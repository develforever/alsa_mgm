import {
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";
import { ALAssLine } from "./ALAssLine";
import { BaseAuditEntity } from "./BaseAuditEntity";

@Entity("Product")
export class Product extends BaseAuditEntity {
    @PrimaryGeneratedColumn({ name: "ProductID" })
    ProductID!: number;

    @Column({ type: "varchar", length: 255 })
    Name!: string;

    @Column({ type: "tinyint", width: 1, default: 1 })
    Active!: number;

    @CreateDateColumn({ name: "CreatedAt" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "UpdatedAt" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "DeletedAt" })
    deletedAt?: Date;

    @OneToMany(() => ALAssLine, (line) => line.product)
    assemblyLines!: ALAssLine[];
}