import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ALAssLine } from "../entity/ALAssLine";
import { BaseRepository } from "./BaseRepository";

/**
 * Repository for Assembly Line entity
 * Provides data access operations with audit support
 */
export class AssemblyLineRepository extends BaseRepository<ALAssLine> {
    private repository: Repository<ALAssLine>;

    constructor() {
        super();
        this.repository = AppDataSource.getRepository(ALAssLine);
    }

    protected getRepository(): Repository<ALAssLine> {
        return this.repository;
    }

    /**
     * Find assembly lines with pagination and name filter
     */
    async findAssemblyLines(page = 0, size = 10, filter?: string) {
        return this.findPaginated(
            { page, size },
            { filter, filterableColumns: ["Name"] },
            { sortBy: "ALAssLineID", sortOrder: "DESC" }
        );
    }

    /**
     * Find assembly line by ID with product relation
     */
    async findByLineId(id: number): Promise<ALAssLine | null> {
        return this.getRepository().findOne({
            where: { ALAssLineID: id },
            relations: { product: true }
        });
    }

    /**
     * Create a new assembly line with audit
     */
    async createAssemblyLine(data: Partial<ALAssLine>, userEmail?: string): Promise<ALAssLine> {
        return this.create(data, userEmail);
    }

    /**
     * Update assembly line by ID
     */
    async updateAssemblyLine(id: number, data: Partial<ALAssLine>): Promise<ALAssLine | null> {
        return this.update(id, "ALAssLineID", data);
    }

    /**
     * Soft delete assembly line
     */
    async deleteAssemblyLine(id: number): Promise<void> {
        return this.softDelete(id, "ALAssLineID");
    }
}

// Export singleton instance
export const assemblyLineRepository = new AssemblyLineRepository();
