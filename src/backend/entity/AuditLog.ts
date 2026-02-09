
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("AuditLog")
export class AuditLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    action!: string; 

    @Column()
    entityName!: string; 

    @Column({ nullable: true })
    entityId!: string;

    @Column({ type: "json", nullable: true })
    details!: any; 

    @Column({ nullable: true })
    userEmail!: string; 

    @CreateDateColumn()
    timestamp!: Date;
}