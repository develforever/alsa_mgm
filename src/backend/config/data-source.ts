import "reflect-metadata"
import { DataSource } from "typeorm"
import { Product } from "../entity/Product"
import { ALAssLine } from "../entity/ALAssLine"
import { ALWStation } from "../entity/ALWStation"
import { ALAssLineWStationAllocation } from "../entity/ALAssLineWStationAllocation"
import { AuditLog } from "../entity/AuditLog"
import { AuditSubscriber } from "../entities/subscribers/AuditSubscriber"
import config from "../config/config"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    username: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [Product, ALAssLine, ALWStation, ALAssLineWStationAllocation, AuditLog],
    subscribers: [AuditSubscriber],
    migrations: [],
})
