import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { Product } from "../entity/Product"
import { ALAssLine } from "../entity/ALAssLine"
import { ALWStation } from "../entity/ALWStation"
import { ALAssLineWStationAllocation } from "../entity/ALAssLineWStationAllocation"
import { AuditLog } from "../entity/AuditLog"
import { User } from "../entity/User"
import { ProductionPlan } from "../entity/ProductionPlan"
import { AuditSubscriber } from "../entities/subscribers/AuditSubscriber"
import config from "../config/config"
import { URL } from "url";

const entities = [Product, ALAssLine, ALWStation, ALAssLineWStationAllocation, AuditLog, User, ProductionPlan];
const subscribers = [AuditSubscriber];

export type APP_DATA_SOURCE_TYPES = "mysql" | "cockroachdb" | "sqlite";

export function createDataSourceOptions(): DataSourceOptions {
    const dataSourceType: APP_DATA_SOURCE_TYPES = (config.APP_DATA_SOURCE_TYPE || "mysql") as APP_DATA_SOURCE_TYPES;

    switch (dataSourceType) {
        case "mysql":
            return {
                type: "mysql",
                host: config.DATABASE_HOST,
                port: config.DATABASE_PORT,
                username: config.DATABASE_USER,
                password: config.DATABASE_PASSWORD,
                database: config.DATABASE_NAME,
                synchronize: true,
                logging: true,
                entities,
                subscribers,
                migrations: [],
            };
        case "cockroachdb": {
            if (!config.COCKROACH_DB_URL) {
                throw new Error("COCKROACH_DB_URL is required when APP_DATA_SOURCE_TYPE is 'cockroachdb'");
            }
            const dbUrl = new URL(config.COCKROACH_DB_URL);
            const routingId = dbUrl.searchParams.get("options");
            dbUrl.searchParams.delete("options");
            return {
                type: "cockroachdb",
                url: dbUrl.toString(),
                ssl: true,
                extra: {
                    options: routingId
                },
                synchronize: true,
                timeTravelQueries: false,
                entities,
                subscribers,
                migrations: [],
            };
        }
        case "sqlite":
            return {
                type: "better-sqlite3",
                database: "database.sqlite",
                statementCacheSize: 100,
                readonly: false,
                synchronize: true,
                entities,
                subscribers,
                migrations: [],
                prepareDatabase: (db: any) => {
                    db.pragma('journal_mode = WAL');
                    db.pragma('synchronous = NORMAL');
                    db.pragma('busy_timeout = 5000');
                },
            };
        default:
            throw new Error(`Unsupported data source type: ${dataSourceType}`);
    }
}

export const AppDataSource = new DataSource(createDataSourceOptions());