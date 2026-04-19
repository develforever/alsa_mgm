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

    @Column({ type: "boolean", default: true })
    Active!: boolean;

    @CreateDateColumn({ name: "CreatedAt" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "UpdatedAt" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "DeletedAt" })
    deletedAt?: Date;

    @OneToMany(() => ALAssLine, (line) => line.product)
    assemblyLines!: ALAssLine[];
}