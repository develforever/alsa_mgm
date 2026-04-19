import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";
import { Product } from "./Product";
import { ALAssLineWStationAllocation } from "./ALAssLineWStationAllocation";

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

    @Column({ type: "integer" })
    Status: ALAssLineStatus;

    @CreateDateColumn({ name: "CreatedAt" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "UpdatedAt" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "DeletedAt" })
    deletedAt?: Date;

    @OneToMany(() => ALAssLineWStationAllocation, (alloc) => alloc.assemblyLine)
    allocations: ALAssLineWStationAllocation[];
}