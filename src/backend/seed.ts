import * as dotenv from "dotenv-flow";
dotenv.config();
import { DataSource } from "typeorm";
import { createDataSourceOptions } from "./config/data-source";
import { Product } from "./entity/Product";
import { ALAssLine, ALAssLineStatus } from "./entity/ALAssLine";
import { ALWStation } from "./entity/ALWStation";
import { ALAssLineWStationAllocation } from "./entity/ALAssLineWStationAllocation";
import { AuditLog } from "./entity/AuditLog";
import { User, UserRole } from "./entity/User";
import { ProductionPlan, ProductionPlanStatus, ProductionPriority } from "./entity/ProductionPlan";

type SeedScale = "small" | "medium" | "full";

interface SeedConfig {
    users: number;
    products: number;
    workstations: number;
    lines: number;
    allocations: number;
    plans: number;
    auditLogs: number;
}

const CONFIGS: Record<SeedScale, SeedConfig> = {
    small: { users: 5, products: 5, workstations: 8, lines: 6, allocations: 20, plans: 4, auditLogs: 10 },
    medium: { users: 10, products: 15, workstations: 20, lines: 25, allocations: 80, plans: 25, auditLogs: 100 },
    full: { users: 20, products: 30, workstations: 40, lines: 50, allocations: 200, plans: 60, auditLogs: 500 },
};

function getConfig(): SeedConfig {
    const scale = (process.env.SEED_SCALE || "small") as SeedScale;
    return CONFIGS[scale] || CONFIGS.small;
}

function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
    return arr[rand(0, arr.length - 1)];
}

function pickN<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, arr.length));
}

function randomDate(from: Date, to: Date): Date {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

// ─── Clean Database ──────────────────────────────────────────────────────────

async function dropAllTables(ds: DataSource): Promise<void> {
    const tables = [
        "ProductionPlanWorkstation",
        "ProductionPlan",
        "ALAssLineWStationAllocation",
        "ALAssLine",
        "ALWStation",
        "Product",
        "AuditLog",
        "User",
    ];

    const driverType = ds.options.type;

    if (driverType === "mysql") {
        await ds.query("SET FOREIGN_KEY_CHECKS = 0");
        for (const table of tables) {
            await ds.query(`DROP TABLE IF EXISTS \`${table}\``);
        }
        await ds.query("SET FOREIGN_KEY_CHECKS = 1");
    } else if (driverType === "cockroachdb") {
        for (const table of tables) {
            await ds.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        }
        // Drop remaining user sequences (CASCADE on table doesn't drop them in CockroachDB)
        const seqResult = await ds.query(
            `SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public'`
        );
        for (const row of seqResult) {
            await ds.query(`DROP SEQUENCE IF EXISTS "${row.sequence_name}" CASCADE`);
        }
        // Drop user enum types (skip system ones like crdb_internal_*)
        const enumResult = await ds.query(
            `SELECT t.typname FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'public' AND t.typtype = 'e' AND t.typname NOT LIKE 'crdb_internal_%'`
        );
        for (const row of enumResult) {
            await ds.query(`DROP TYPE IF EXISTS "${row.typname}"`);
        }
    } else {
        for (const table of tables) {
            await ds.query(`DROP TABLE IF EXISTS "${table}"`);
        }
    }
}

// ─── Data Factories ──────────────────────────────────────────────────────────

const PRODUCT_NAMES = [
    "8DAB - Control Unit", "8DJH - Power Module", "SIMOSEC - Switchgear",
    "SIPROTEC 5 - Relay", "SIRIUS - Soft Starter", "SIMATIC S7-1500",
    "SINAMICS G120 - Drive", "SIWAREX - Weighing", "SIMOCODE - Motor Protection",
    "3WL - Air Circuit Breaker", "3VL - Molded Case Breaker", "7KM - Measuring Device",
    "SENTRON - Power Monitoring", "TIA Portal - Engineering", "SIVACON - Switchboard",
    "SIMARIS - Planning Tool", "ALPHA - Distribution Board", "CAPRI - Terminal Block",
    "WALLSEAT - Mounting System", "RACKLINE - Server Cabinet", "MODU - Modular System",
    "BUSBAR - Trunking System", "CUBIC - Enclosure", "PLANET - Power Supply",
    "ORION - Lighting Controller", "NOVA - Energy Meter", "PULSAR - UPS System",
    "QUASAR - Transformer", "NEBULA - Busway", "GALAXY - Generator",
];

const WORKSTATION_TEMPLATES = [
    { prefix: "LW", name: "Laser welding" },
    { prefix: "SS", name: "Screwing station" },
    { prefix: "HVD", name: "HV/PD Diagnostic" },
    { prefix: "FI", name: "Final Inspection" },
    { prefix: "PK", name: "Packaging Unit" },
    { prefix: "TS", name: "Torque Station" },
    { prefix: "CR", name: "Crimping Station" },
    { prefix: "SL", name: "Soldering Station" },
    { prefix: "GL", name: "Gluing Station" },
    { prefix: "PT", name: "Press Testing" },
    { prefix: "VI", name: "Visual Inspection" },
    { prefix: "EC", name: "Electrical Test" },
    { prefix: "MC", name: "Mechanical Check" },
    { prefix: "CL", name: "Calibration Unit" },
    { prefix: "AS", name: "Assembly Bench" },
    { prefix: "WS", name: "Wire Stripping" },
    { prefix: "CT", name: "Continuity Test" },
    { prefix: "HT", name: "Hi-Pot Test" },
    { prefix: "LB", name: "Labeling Station" },
    { prefix: "SK", name: "Screw Driving" },
];

const LINE_NAMES = [
    "Convey line", "Manual bench", "Automation Line", "Rotary Table",
    "Pallet System", "Transfer Line", "Indexing Table", "Walking Beam",
    "Chain Conveyor", "Belt Line", "Smart Cell", "Flexible Line",
];

const AUDIT_ACTIONS = ["CREATE", "UPDATE", "DELETE", "SOFT_DELETE", "RESTORE"];
const AUDIT_ENTITIES = ["Product", "ALAssLine", "ALWStation", "ALAssLineWStationAllocation", "ProductionPlan", "User"];

function createUsers(count: number): Partial<User>[] {
    const roles = [UserRole.Admin, UserRole.Operator, UserRole.Operator, UserRole.Operator, UserRole.Viewer];
    const users: Partial<User>[] = [
        { githubId: "admin-seed", username: "admin", displayName: "Admin User", email: "admin@example.dev", role: UserRole.Admin, isActive: true },
        { githubId: "operator-seed", username: "operator", displayName: "Operator User", email: "operator@example.dev", role: UserRole.Operator, isActive: true },
    ];
    for (let i = users.length; i < count; i++) {
        const idx = i - 2;
        users.push({
            githubId: `user-seed-${idx}`,
            username: `user_${idx}`,
            displayName: `User ${idx}`,
            email: `user${idx}@example.dev`,
            role: pick(roles),
            isActive: Math.random() > 0.1,
        });
    }
    return users;
}

function createProducts(count: number): Partial<Product>[] {
    const products: Partial<Product>[] = [];
    const names = pickN(PRODUCT_NAMES, count);
    for (let i = 0; i < count; i++) {
        products.push({
            Name: names[i] || `Product-${i + 1}`,
            Active: Math.random() > 0.15,
        });
    }
    return products;
}

function createWorkstations(count: number): Partial<ALWStation>[] {
    const stations: Partial<ALWStation>[] = [];
    for (let i = 0; i < count; i++) {
        const tpl = WORKSTATION_TEMPLATES[i % WORKSTATION_TEMPLATES.length];
        const suffix = i >= WORKSTATION_TEMPLATES.length ? `-${Math.floor(i / WORKSTATION_TEMPLATES.length) + 1}` : "";
        stations.push({
            Name: `${tpl.name}${suffix}`,
            ShortName: `${tpl.prefix}${suffix}`,
            PCName: `PC-${String(i + 1).padStart(3, "0")}`,
            AutoStart: Math.random() > 0.5,
        });
    }
    return stations;
}

function createLines(products: Product[], count: number): Partial<ALAssLine>[] {
    const statuses = [ALAssLineStatus.Active, ALAssLineStatus.Active, ALAssLineStatus.Active, ALAssLineStatus.Locked, ALAssLineStatus.Closed];
    const lines: Partial<ALAssLine>[] = [];
    for (let i = 0; i < count; i++) {
        const lineType = LINE_NAMES[i % LINE_NAMES.length];
        const suffix = i >= LINE_NAMES.length ? ` ${String.fromCharCode(65 + Math.floor(i / LINE_NAMES.length))}` : "";
        lines.push({
            ProductID: pick(products).ProductID,
            Name: `${lineType}${suffix}`,
            Status: pick(statuses),
        });
    }
    return lines;
}

function createAllocations(lines: ALAssLine[], stations: ALWStation[], count: number): Partial<ALAssLineWStationAllocation>[] {
    const allocations: Partial<ALAssLineWStationAllocation>[] = [];
    const used = new Set<string>();
    let attempts = 0;

    while (allocations.length < count && attempts < count * 3) {
        attempts++;
        const line = pick(lines);
        const station = pick(stations);
        const key = `${line.ALAssLineID}-${station.ALWStationID}`;
        if (used.has(key)) continue;
        used.add(key);

        allocations.push({
            ALAssLineID: line.ALAssLineID,
            ALWStationID: station.ALWStationID,
            Sort: allocations.length + 1,
        });
    }
    return allocations;
}

function createPlans(products: Product[], lines: ALAssLine[], stations: ALWStation[], users: User[], count: number): Partial<ProductionPlan>[] {
    const statusWeights: [ProductionPlanStatus, number][] = [
        [ProductionPlanStatus.Draft, 40],
        [ProductionPlanStatus.Scheduled, 25],
        [ProductionPlanStatus.InProgress, 20],
        [ProductionPlanStatus.Completed, 10],
        [ProductionPlanStatus.Cancelled, 5],
    ];

    function weightedStatus(): ProductionPlanStatus {
        const total = statusWeights.reduce((s, [, w]) => s + w, 0);
        let r = Math.random() * total;
        for (const [status, weight] of statusWeights) {
            r -= weight;
            if (r <= 0) return status;
        }
        return ProductionPlanStatus.Draft;
    }

    const priorityValues = [ProductionPriority.Low, ProductionPriority.Normal, ProductionPriority.Normal, ProductionPriority.High, ProductionPriority.Critical];
    const notes = [
        "Priority order from customer", "Replenishment stock", "R&D prototype batch",
        "Contract fulfillment", "Emergency replacement", "Scheduled maintenance run",
        "Quality audit sample", null, null, null,
    ];

    const plans: Partial<ProductionPlan>[] = [];
    for (let i = 0; i < count; i++) {
        const product = pick(products);
        const productLines = lines.filter(l => l.ProductID === product.ProductID);
        const line = productLines.length > 0 ? pick(productLines) : pick(lines);
        const status = weightedStatus();
        const now = new Date();
        const plannedStart = randomDate(new Date(now.getTime() - 7 * 86400000), new Date(now.getTime() + 30 * 86400000));
        const duration = rand(1, 14);
        const plannedEnd = new Date(plannedStart.getTime() + duration * 86400000);

        const hasActuals = status === ProductionPlanStatus.InProgress || status === ProductionPlanStatus.Completed;
        const actualStart = hasActuals ? new Date(plannedStart.getTime() + rand(0, 86400000)) : null;
        const actualEnd = status === ProductionPlanStatus.Completed ? new Date(actualStart!.getTime() + rand(duration * 0.8, duration * 1.2) * 86400000) : null;
        const plannedQty = rand(50, 2000);
        const actualQty = hasActuals ? Math.floor(plannedQty * (0.7 + Math.random() * 0.35)) : 0;

        const wsCount = rand(1, Math.min(5, stations.length));
        const planStations = pickN(stations, wsCount);

        plans.push({
            productId: product.ProductID,
            assemblyLineId: line.ALAssLineID,
            plannedStartDate: plannedStart,
            plannedEndDate: plannedEnd,
            plannedQuantity: plannedQty,
            actualStartDate: actualStart,
            actualEndDate: actualEnd,
            actualQuantity: actualQty,
            status,
            priority: pick(priorityValues),
            notes: pick(notes),
            createdBy: users.length > 0 ? pick(users).id : null,
            workstations: planStations,
        });
    }
    return plans;
}

function createAuditLogs(count: number): Partial<AuditLog>[] {
    const now = new Date();
    const logs: Partial<AuditLog>[] = [];
    for (let i = 0; i < count; i++) {
        const entityName = pick(AUDIT_ENTITIES);
        const action = pick(AUDIT_ACTIONS);
        logs.push({
            action,
            entityName,
            entityId: String(rand(1, 50)),
            details: { field: "status", from: "draft", to: "active" },
            userEmail: `user${rand(1, 10)}@example.dev`,
            timestamp: randomDate(new Date(now.getTime() - 30 * 86400000), now),
        });
    }
    return logs;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const seed = async () => {
    const seedConfig = getConfig();
    console.log(`🌱 Seed scale: ${process.env.SEED_SCALE || "small"}`);
    console.log(`   Config: ${JSON.stringify(seedConfig)}`);

    try {
        // Create DataSource with synchronize:false — we'll handle schema manually
        const options = createDataSourceOptions();
        (options as unknown as Record<string, unknown>).synchronize = false;
        const ds = new DataSource(options);

        await ds.initialize();
        console.log("✅ Data Source initialized");

        console.log("🧹 Dropping all tables...");
        await dropAllTables(ds);

        console.log("📐 Synchronizing schema...");
        await ds.synchronize();
        console.log("✅ Schema created");

        // Users
        console.log(`👥 Seeding ${seedConfig.users} users...`);
        const userRepo = ds.getRepository(User);
        const users = await userRepo.save(createUsers(seedConfig.users)) as User[];

        // Products
        console.log(`📦 Seeding ${seedConfig.products} products...`);
        const productRepo = ds.getRepository(Product);
        const products = await productRepo.save(createProducts(seedConfig.products)) as Product[];

        // Workstations
        console.log(`🛠️  Seeding ${seedConfig.workstations} workstations...`);
        const stationRepo = ds.getRepository(ALWStation);
        const stations = await stationRepo.save(createWorkstations(seedConfig.workstations)) as ALWStation[];

        // Assembly Lines
        console.log(`🛤️  Seeding ${seedConfig.lines} assembly lines...`);
        const lineRepo = ds.getRepository(ALAssLine);
        const lines = await lineRepo.save(createLines(products, seedConfig.lines)) as ALAssLine[];

        // Allocations
        console.log(`🔗 Seeding ${seedConfig.allocations} allocations...`);
        const allocRepo = ds.getRepository(ALAssLineWStationAllocation);
        const allocations = await allocRepo.save(createAllocations(lines, stations, seedConfig.allocations)) as ALAssLineWStationAllocation[];

        // Production Plans
        console.log(`📋 Seeding ${seedConfig.plans} production plans...`);
        const planRepo = ds.getRepository(ProductionPlan);
        const plans = await planRepo.save(createPlans(products, lines, stations, users, seedConfig.plans)) as ProductionPlan[];

        // Audit Logs
        console.log(`📝 Seeding ${seedConfig.auditLogs} audit logs...`);
        const auditRepo = ds.getRepository(AuditLog);
        await auditRepo.save(createAuditLogs(seedConfig.auditLogs));

        console.log("");
        console.log("✅ Seed completed successfully!");
        console.log(`   Users: ${users.length}`);
        console.log(`   Products: ${products.length}`);
        console.log(`   Workstations: ${stations.length}`);
        console.log(`   Assembly Lines: ${lines.length}`);
        console.log(`   Allocations: ${allocations.length}`);
        console.log(`   Production Plans: ${plans.length}`);
        console.log(`   Audit Logs: ${seedConfig.auditLogs}`);

        await ds.destroy();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
};

seed();