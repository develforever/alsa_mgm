import { ApiResponseList, ApiResponseSingle } from "@shared/api/ApiResponse";
import { GetProductSchema, GetProductsSchema } from "@shared/api/product/schema";
import { AppDataSource } from "config/data-source";
import { Product } from "entity/Product";



export class ProductMapper {


    public static toGetProductsSchema(products: { items: Product[], total: number, page: number, size: number }): ApiResponseList<GetProductsSchema> {

        const items = products.items.map(product => ({
            ProductID: product.ProductID,
            Name: product.Name,
            Active: product.Active,
            CreatedAt: product.createdAt,
            UpdatedAt: product.updatedAt,
        }));

        const entityMetadata = AppDataSource.getMetadata(Product);

        return {
            data: items,
            meta: {
                page: products.page,
                limit: products.size,
                total: products.total,
                links: {
                    details: `/api/products/{id}`
                },
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

    public static toGetProductSchema(product: Product): ApiResponseSingle<GetProductSchema> {

        const entityMetadata = AppDataSource.getMetadata(Product);

        return {
            data: {
                ProductID: product.ProductID,
                Name: product.Name,
                Active: product.Active,
                CreatedAt: product.createdAt,
                UpdatedAt: product.updatedAt,
            },
            meta: {
                entity: {
                    primaryKey: entityMetadata.primaryColumns.map(column => column.propertyName).join(','),
                }
            }
        };
    }

}