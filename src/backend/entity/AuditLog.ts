// backend/src/entities/AuditLog.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("AuditLog")
export class AuditLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    action!: string; // np. "CREATE", "UPDATE", "SOFT-DELETE"

    @Column()
    entityName!: string; // np. "Product", "ALAssLine"

    @Column({ nullable: true })
    entityId!: string;

    @Column({ type: "json", nullable: true })
    details!: any; // Przechowamy tu stan obiektu przed/po zmianie

    @Column({ nullable: true })
    userEmail!: string; // Kto to zrobił (z GitHuba)

    @CreateDateColumn()
    timestamp!: Date;
}