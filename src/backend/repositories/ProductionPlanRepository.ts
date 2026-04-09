import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ProductionPlan, ProductionPlanStatus } from "../entity/ProductionPlan";

export interface ProductionPlanFilter {
    productId?: number;
    assemblyLineId?: number;
    status?: ProductionPlanStatus;
    startDateFrom?: Date;
    startDateTo?: Date;
}

export class ProductionPlanRepository {
    private repository: Repository<ProductionPlan>;

    constructor() {
        this.repository = AppDataSource.getRepository(ProductionPlan);
    }

    async findAll(
        page: number,
        size: number,
        filter?: ProductionPlanFilter
    ): Promise<[ProductionPlan[], number]> {
        // Validate pagination parameters
        if (page < 0) page = 0;
        if (size <= 0) size = 10;

        const where: FindOptionsWhere<ProductionPlan> = {};

        if (filter) {
            if (filter.productId) {
                where.productId = filter.productId;
            }
            if (filter.assemblyLineId) {
                where.assemblyLineId = filter.assemblyLineId;
            }
            if (filter.status) {
                where.status = filter.status;
            }
            if (filter.startDateFrom && filter.startDateTo) {
                where.plannedStartDate = Between(filter.startDateFrom, filter.startDateTo);
            } else if (filter.startDateFrom) {
                where.plannedStartDate = MoreThanOrEqual(filter.startDateFrom);
            } else if (filter.startDateTo) {
                where.plannedStartDate = LessThanOrEqual(filter.startDateTo);
            }
        }

        return this.repository.findAndCount({
            where,
            relations: ["product", "assemblyLine", "workstations", "creator"],
            order: { plannedStartDate: "DESC" },
            skip: page * size,
            take: size,
        });
    }

    async findById(id: number): Promise<ProductionPlan | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["product", "assemblyLine", "workstations", "creator"],
        });
    }

    async findOverlappingPlans(
        assemblyLineId: number,
        plannedStartDate: Date,
        plannedEndDate: Date,
        excludeId?: number
    ): Promise<ProductionPlan[]> {
        const query = this.repository
            .createQueryBuilder("plan")
            .where("plan.assemblyLineId = :assemblyLineId", { assemblyLineId })
            .andWhere(
                "(plan.plannedStartDate <= :endDate AND plan.plannedEndDate >= :startDate)",
                { startDate: plannedStartDate, endDate: plannedEndDate }
            )
            .andWhere("plan.status IN (:...statuses)", {
                statuses: [ProductionPlanStatus.Scheduled, ProductionPlanStatus.InProgress]
            });

        if (excludeId) {
            query.andWhere("plan.id != :excludeId", { excludeId });
        }

        return query.getMany();
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<ProductionPlan[]> {
        return this.repository.find({
            where: {
                plannedStartDate: Between(startDate, endDate),
            },
            relations: ["product", "assemblyLine", "workstations"],
            order: { plannedStartDate: "ASC" },
        });
    }

    async save(plan: ProductionPlan): Promise<ProductionPlan> {
        return this.repository.save(plan);
    }

    async update(id: number, data: Partial<ProductionPlan>): Promise<void> {
        await this.repository.update(id, data);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async countByStatus(status: ProductionPlanStatus): Promise<number> {
        return this.repository.count({ where: { status } });
    }

    async findUpcoming(limit = 10): Promise<ProductionPlan[]> {
        const now = new Date();
        return this.repository.find({
            where: {
                plannedStartDate: MoreThanOrEqual(now),
                status: ProductionPlanStatus.Scheduled,
            },
            relations: ["product", "assemblyLine"],
            order: { plannedStartDate: "ASC" },
            take: limit,
        });
    }
}

export const productionPlanRepo = new ProductionPlanRepository();
