import { GetProductSchema, GetProductsSchema } from "@shared/api/product/schema";
import { Product } from "entity/Product";



export class ProductMapper {


    public static toGetProductsSchema(products: Product[]): GetProductsSchema[] {
        return products.map(product => ({
            ProductID: product.ProductID,
            Name: product.Name,
            Active: product.Active,
            CreatedAt: product.createdAt,
            UpdatedAt: product.updatedAt,
        }));
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