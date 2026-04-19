import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    Index
} from "typeorm";
import { Product } from "./Product";
import { ALAssLine } from "./ALAssLine";
import { ALWStation } from "./ALWStation";
import { User } from "./User";

export enum ProductionPlanStatus {
    Draft = 'draft',
    Scheduled = 'scheduled',
    InProgress = 'in_progress',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

export enum ProductionPriority {
    Low = 1,
    Normal = 2,
    High = 3,
    Critical = 4
}

@Entity("ProductionPlan")
@Index(["plannedStartDate"])
@Index(["status"])
@Index(["productId", "plannedStartDate"])
export class ProductionPlan {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    productId!: number;

    @ManyToOne(() => Product, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productId" })
    product!: Product;

    @Column()
    assemblyLineId!: number;

    @ManyToOne(() => ALAssLine, { onDelete: "CASCADE" })
    @JoinColumn({ name: "assemblyLineId" })
    assemblyLine!: ALAssLine;

    @ManyToMany(() => ALWStation, { cascade: true })
    @JoinTable({
        name: "ProductionPlanWorkstation",
        joinColumn: { name: "planId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "workstationId", referencedColumnName: "ALWStationID" }
    })
    workstations!: ALWStation[];

    @Column({ type: "timestamp" })
    plannedStartDate!: Date;

    @Column({ type: "timestamp" })
    plannedEndDate!: Date;

    @Column({ type: "int" })
    plannedQuantity!: number;

    @Column({ type: "timestamp", nullable: true })
    actualStartDate!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    actualEndDate!: Date | null;

    @Column({ type: "int", default: 0 })
    actualQuantity!: number;

    @Column({
        type: "enum",
        enum: ProductionPlanStatus,
        default: ProductionPlanStatus.Draft
    })
    status!: ProductionPlanStatus;

    @Column({
        type: "enum",
        enum: ProductionPriority,
        default: ProductionPriority.Normal
    })
    priority!: ProductionPriority;

    @Column({ type: "text", nullable: true })
    notes!: string | null;

    @Column({ nullable: true })
    createdBy!: number | null;

    @ManyToOne(() => User, { onDelete: "SET NULL" })
    @JoinColumn({ name: "createdBy" })
    creator!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
