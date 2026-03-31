import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entity/Product";
import { BaseRepository } from "./BaseRepository";

/**
 * Repository for Product entity
 * Provides data access operations with audit support
 */
export class ProductRepository extends BaseRepository<Product> {
    private repository: Repository<Product>;

    constructor() {
        super();
        this.repository = AppDataSource.getRepository(Product);
    }

    protected getRepository(): Repository<Product> {
        return this.repository;
    }

    /**
     * Find products with pagination and name filter
     */
    async findProducts(page = 0, size = 10, filter?: string) {
        return this.findPaginated(
            { page, size },
            { filter, filterableColumns: ["Name"] },
            { sortBy: "ProductID", sortOrder: "DESC" }
        );
    }

    /**
     * Find product by ID
     */
    async findByProductId(id: number): Promise<Product | null> {
        return this.findById(id, "ProductID");
    }

    /**
     * Create a new product with audit
     */
    async createProduct(data: Partial<Product>, userEmail?: string): Promise<Product> {
        return this.create(data, userEmail);
    }

    /**
     * Update product by ID
     */
    async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
        return this.update(id, "ProductID", data);
    }

    /**
     * Soft delete product
     */
    async deleteProduct(id: number): Promise<void> {
        return this.softDelete(id, "ProductID");
    }
}

// Export singleton instance
export const productRepository = new ProductRepository();
