import "reflect-metadata"
import { DataSource } from "typeorm"
import { Product } from "../entity/Product"
import { ALAssLine } from "../entity/ALAssLine"
import { ALWStation } from "../entity/ALWStation"
import { ALAssLineWStationAllocation } from "../entity/ALAssLineWStationAllocation"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "user",
    password: "user_password",
    database: "transmar_task",
    synchronize: true,
    logging: false,
    entities: [Product, ALAssLine, ALWStation, ALAssLineWStationAllocation],
    migrations: [],
    subscribers: [],
})
