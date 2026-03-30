import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";
import { ALAssLineWStationAllocation } from "./ALAssLineWStationAllocation";
import { BaseAuditEntity } from "./BaseAuditEntity";

@Entity("ALWStation")
export class ALWStation extends BaseAuditEntity {
  @PrimaryGeneratedColumn()
  ALWStationID: number;

  @Column({ type: "varchar", length: 255 })
  Name: string;

  @Column({ type: "varchar", length: 50 })
  ShortName: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  PCName: string;

  @Column({ type: "tinyint", width: 1, default: 0 })
  AutoStart: number;

  @CreateDateColumn({ name: "CreatedAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "UpdatedAt" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "DeletedAt" })
  deletedAt?: Date;

  @OneToMany(() => ALAssLineWStationAllocation, (alloc) => alloc.workstation)
  allocations: ALAssLineWStationAllocation[];
}