import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ALAssLine } from "./ALAssLine";

@Entity("Product") 
export class Product {
    @PrimaryGeneratedColumn({ name: "ProductID" })
    ProductID!: number;

    @Column({ type: "varchar", length: 255 })
    Name!: string;

    @Column({ type: "tinyint", width: 1, default: 1 })
    Active!: number;

    @OneToMany(() => ALAssLine, (line) => line.product)
    assemblyLines!: ALAssLine[];
}