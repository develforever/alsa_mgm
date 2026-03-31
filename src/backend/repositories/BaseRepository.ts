import { Repository, ObjectLiteral, FindOptionsWhere, Like, FindManyOptions } from "typeorm";
import { sanitizeLikeFilter } from "../utils/filter.utils";

export interface PaginationOptions {
    page: number;
    size: number;
}

export interface FilterOptions<T extends ObjectLiteral> {
    filter?: string;
    filterableColumns?: (keyof T)[];
}

export interface SortOptions<T extends ObjectLiteral> {
    sortBy?: keyof T;
    sortOrder?: "ASC" | "DESC";
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
}

/**
 * Generic repository that provides common CRUD operations
 * with built-in pagination, filtering, and soft delete support
 */
export abstract class BaseRepository<T extends ObjectLiteral> {
    protected abstract getRepository(): Repository<T>;

    /**
     * Find all entities with pagination and optional filtering
     */
    async findPaginated(
        pagination: PaginationOptions,
        filter?: FilterOptions<T>,
        sort?: SortOptions<T>
    ): Promise<PaginatedResult<T>> {
        const repo = this.getRepository();
        const { page, size } = pagination;

        const where: FindOptionsWhere<T> = {};

        // Apply filter if provided
        if (filter?.filter && filter.filterableColumns && filter.filterableColumns.length > 0) {
            const sanitizedFilter = sanitizeLikeFilter(filter.filter);
            if (sanitizedFilter) {
                const filterColumn = filter.filterableColumns[0];
                (where as Record<string, unknown>)[String(filterColumn)] = Like(`%${sanitizedFilter}%`);
            }
        }

        const findOptions: FindManyOptions<T> = {
            skip: (page > 0 ? page - 1 : 0) * size,
            take: size,
            where,
        };

        // Apply sorting
        if (sort?.sortBy) {
            findOptions.order = {
                [sort.sortBy as string]: sort.sortOrder || "ASC"
            } as unknown as FindManyOptions<T>['order'];
        }

        const [items, total] = await repo.findAndCount(findOptions);

        return {
            items,
            total,
            page,
            size
        };
    }

    /**
     * Find all entities without pagination
     */
    async findAll(filter?: FindOptionsWhere<T>): Promise<T[]> {
        return this.getRepository().find({ where: filter });
    }

    /**
     * Find a single entity by its primary key
     */
    async findById(id: number | string, primaryKey: keyof T): Promise<T | null> {
        const where: FindOptionsWhere<T> = { [primaryKey]: id } as FindOptionsWhere<T>;
        return this.getRepository().findOneBy(where);
    }

    /**
     * Find a single entity with custom filter
     */
    async findOne(filter: FindOptionsWhere<T>): Promise<T | null> {
        return this.getRepository().findOneBy(filter);
    }

    /**
     * Create a new entity
     */
    async create(data: Partial<T>, userEmail?: string): Promise<T> {
        const repo = this.getRepository();
        const entity = repo.create(data as T);
        return repo.save(entity, {
            data: { userEmail }
        });
    }

    /**
     * Update an entity by its primary key
     */
    async update(
        id: number | string,
        primaryKey: keyof T,
        data: Partial<T>
    ): Promise<T | null> {
        const repo = this.getRepository();
        const where: FindOptionsWhere<T> = { [primaryKey]: id } as FindOptionsWhere<T>;

        await repo.update(where, data);
        return this.findById(id, primaryKey);
    }

    /**
     * Soft delete an entity by its primary key
     */
    async softDelete(id: number | string, primaryKey: keyof T): Promise<void> {
        const where: FindOptionsWhere<T> = { [primaryKey]: id } as FindOptionsWhere<T>;
        await this.getRepository().softDelete(where);
    }

    /**
     * Hard delete an entity by its primary key (use with caution)
     */
    async hardDelete(id: number | string, primaryKey: keyof T): Promise<void> {
        const where: FindOptionsWhere<T> = { [primaryKey]: id } as FindOptionsWhere<T>;
        await this.getRepository().delete(where);
    }

    /**
     * Count entities with optional filter
     */
    async count(filter?: FindOptionsWhere<T>): Promise<number> {
        return this.getRepository().count({ where: filter });
    }

    /**
     * Check if entity exists
     */
    async exists(id: number | string, primaryKey: keyof T): Promise<boolean> {
        const count = await this.getRepository().count({
            where: { [primaryKey]: id } as FindOptionsWhere<T>
        });
        return count > 0;
    }
}
