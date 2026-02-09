import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from "typeorm";
import { ALAssLine } from "./ALAssLine";
import { ALWStation } from "./ALWStation";

@Entity("ALAssLineWStationAllocation")
export class ALAssLineWStationAllocation {
    @PrimaryGeneratedColumn({ name: "ALAssLineWStationAllocationID" })
    ALAssLineWStationAllocationID!: number;

    @Column()
    ALAssLineID!: number;

    @Column()
    ALWStationID!: number;

    @Column({ type: "smallint" }) // Ważne: SMALLINT z diagramu
    Sort!: number;

    @CreateDateColumn({ name: "CreatedAt" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "UpdatedAt" })
    updatedAt!: Date;

    @DeleteDateColumn({ name: "DeletedAt" })
    deletedAt?: Date;

    @ManyToOne(() => ALAssLine, (line) => line.allocations)
    @JoinColumn({ name: "ALAssLineID" })
    assemblyLine!: ALAssLine;

    @ManyToOne(() => ALWStation, (station) => station.allocations)
    @JoinColumn({ name: "ALWStationID" })
    workstation!: ALWStation;
}