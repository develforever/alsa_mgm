import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

export enum UserRole {
    Admin = 'admin',
    Operator = 'operator',
    Viewer = 'viewer'
}

@Entity("User")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    githubId!: string;

    @Column()
    username!: string;

    @Column({ nullable: true })
    displayName!: string;

    @Column({ nullable: true })
    email!: string;

    @Column({ nullable: true })
    avatarUrl!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.Viewer
    })
    role!: UserRole;

    @Column({ default: true })
    isActive!: boolean;

    @Column({ nullable: true })
    lastLoginAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
