import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Product } from "./Product";
import { ALAssLineWStationAllocation } from "./ALAssLineWStationAllocation";

// 1=Active, 2=Locked, 3=Closed
export enum ALAssLineStatus {
    Active = 1,
    Locked = 2,
    Closed = 3,
}

@Entity("ALAssLine")
export class ALAssLine {
    @PrimaryGeneratedColumn()
    ALAssLineID: number;

    @Column()
    ProductID: number;

    @ManyToOne(() => Product, (product) => product.assemblyLines)
    @JoinColumn({ name: "ProductID" })
    product: Product;

    @Column({ type: "varchar", length: 255 })
    Name: string;

    @Column({ type: "tinyint" })
    Status: ALAssLineStatus;

    @OneToMany(() => ALAssLineWStationAllocation, (alloc) => alloc.assemblyLine)
    allocations: ALAssLineWStationAllocation[];
}