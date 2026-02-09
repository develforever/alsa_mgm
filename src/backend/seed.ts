import { AppDataSource } from "./config/data-source";
import { ALAssLine } from "./entity/ALAssLine";
import { ALWStation } from "./entity/ALWStation";
import { Product } from "./entity/Product";


const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log("🌱 Inicjalizacja bazy danych do seedowania...");

        const productRepo = AppDataSource.getRepository(Product);
        const lineRepo = AppDataSource.getRepository(ALAssLine);
        const stationRepo = AppDataSource.getRepository(ALWStation);

        // 1. Produkty (Active: 1)
        console.log("📦 Dodaję produkty...");
        const p1 = productRepo.create({ Name: "8DAB - Control Unit", Active: 1 });
        const p2 = productRepo.create({ Name: "8DJH - Power Module", Active: 1 });
        const p3 = productRepo.create({ Name: "SIMOSEC - Switchgear", Active: 1 });
        await productRepo.save([p1, p2, p3]);

        // 2. Linie montażowe (Status: 1-Active, 2-Locked)
        console.log("🛤️ Dodaję linie montażowe...");
        const l1 = lineRepo.create({ Name: "Convey line A1", ProductID: p1.ProductID, Status: 1 });
        const l2 = lineRepo.create({ Name: "Manual bench M2", ProductID: p1.ProductID, Status: 1 });
        const l3 = lineRepo.create({ Name: "Automation Line X", ProductID: p2.ProductID, Status: 2 });
        await lineRepo.save([l1, l2, l3]);

        // 3. Stacje robocze (Workstations)
        console.log("🛠️ Dodaję stacje robocze...");
        await stationRepo.save([
            { Name: "Laser welding", ShortName: "LW", PCName: "PC-TRANS-01", AutoStart: 1 },
            { Name: "Screwing station", ShortName: "SS", PCName: "PC-TRANS-02", AutoStart: 0 },
            { Name: "HV/PD Diagnostic", ShortName: "HVD", PCName: "PC-TEST-05", AutoStart: 1 },
            { Name: "Final Inspection", ShortName: "FI", PCName: "PC-QUALITY-01", AutoStart: 0 },
            { Name: "Packaging Unit", ShortName: "PK", PCName: "PC-LOG-10", AutoStart: 1 }
        ]);

        console.log("✅ Seedowanie zakończone sukcesem!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Błąd podczas seedowania:", error);
        process.exit(1);
    }
};

seed();