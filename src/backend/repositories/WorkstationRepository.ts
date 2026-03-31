import { Repository, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { ALWStation } from "../entity/ALWStation";
import { BaseRepository } from "./BaseRepository";

/**
 * Repository for Workstation entity
 * Provides data access operations with audit support
 */
export class WorkstationRepository extends BaseRepository<ALWStation> {
    private repository: Repository<ALWStation>;

    constructor() {
        super();
        this.repository = AppDataSource.getRepository(ALWStation);
    }

    protected getRepository(): Repository<ALWStation> {
        return this.repository;
    }

    /**
     * Find workstations with pagination and name filter
     */
    async findWorkstations(page = 0, size = 10, filter?: string) {
        return this.findPaginated(
            { page, size },
            { filter, filterableColumns: ["Name", "ShortName"] },
            { sortBy: "ALWStationID", sortOrder: "DESC" }
        );
    }

    /**
     * Find workstation by ID
     */
    async findByWorkstationId(id: number): Promise<ALWStation | null> {
        return this.findById(id, "ALWStationID");
    }

    /**
     * Find workstations by auto-start flag
     */
    async findByAutoStart(autoStart: number): Promise<ALWStation[]> {
        return this.findAll({ AutoStart: autoStart } as FindOptionsWhere<ALWStation>);
    }

    /**
     * Create a new workstation with audit
     */
    async createWorkstation(data: Partial<ALWStation>, userEmail?: string): Promise<ALWStation> {
        return this.create(data, userEmail);
    }

    /**
     * Update workstation by ID
     */
    async updateWorkstation(id: number, data: Partial<ALWStation>): Promise<ALWStation | null> {
        return this.update(id, "ALWStationID", data);
    }

    /**
     * Soft delete workstation
     */
    async deleteWorkstation(id: number): Promise<void> {
        return this.softDelete(id, "ALWStationID");
    }
}

// Export singleton instance
export const workstationRepository = new WorkstationRepository();
