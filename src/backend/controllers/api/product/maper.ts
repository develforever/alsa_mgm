import { ApiResponseList } from "@shared/api/ApiResponse";
import { GetProductSchema, GetProductsSchema } from "@shared/api/product/schema";
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
                    primaryKey: 'ProductID'
                }
            }
        };
    }

    public static toGetProductSchema(product: Product): GetProductSchema {
        return {
            ProductID: product.ProductID,
            Name: product.Name,
            Active: product.Active,
            CreatedAt: product.createdAt,
            UpdatedAt: product.updatedAt,
        };
    }

}