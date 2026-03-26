import { AppDataSource } from "../../../../config/data-source";
import { ApiError, ApiResponse, ApiResponseInfo, ApiResponseSingle } from "../../../../../shared/api/ApiResponse";
import { Controller, Get, Route, Query, Tags, Post, Body, Patch, Delete, Request, Path } from "tsoa";
import { Product } from "../../../../entity/Product";
import { ApiRequest } from "@shared/api/ApiRequest";
import { GetProductSchema, GetProductsSchema, PatchProductsSchema, PostProductsSchema } from "@shared/api/product/schema";
import { ProductMapper } from "./product/maper";
import { FindOptionsWhere, Like, FindManyOptions } from "typeorm";

const productRepo = AppDataSource.getRepository(Product);

@Route("api/products")
@Tags("Products")
export class ProductController extends Controller {

    @Get("")
    public async getAll(
        @Query() page = 0,
        @Query() size = 10,
        @Query() filter?: string
    ): Promise<ApiResponse<GetProductsSchema>> {

        const where: FindOptionsWhere<Product> = {};

        if (filter) {
            where.Name = Like(`%${filter}%`);
        }

        const options: FindManyOptions<Product> = {
            skip: (page > 0 ? page - 1 : 0) * size,
            take: size,
            order: {
                ProductID: "DESC"
            },
            where,
        }

        const items = await productRepo.find(options);
        const total = await productRepo.count(options);
        const output = ProductMapper.toGetProductsSchema({
            items,
            total,
            page,
            size,
        });

        return output;
    }

    @Get("{id}")
    public async getOne(
        @Path() id: number
    ): Promise<ApiResponseSingle<GetProductSchema> | ApiError> {
        const item = await productRepo.findOneBy({ ProductID: id });
        if (!item) {
            return {
                message: "Product not found",
                code: 404
            };
        }
        return ProductMapper.toGetProductSchema(item);
    }

    @Post("")
    public async create(
        @Body() body: PostProductsSchema,
        @Request() req: ApiRequest
    ): Promise<ApiResponse<Product>> {

        const { Name, Active } = body;
        const user = req.user;

        if (!Name) {
            return {
                message: "Name is required",
                code: 400
            };
        }
        const newProduct = productRepo.create({ Name, Active: Active ?? 1 });

        await productRepo.save(newProduct, {
            data: { userEmail: user?.userEmail }
        });
        return { data: newProduct };
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: PatchProductsSchema,
    ): Promise<ApiResponse<Product>> {

        await productRepo.update(id, body);

        const updatedProduct = await productRepo.findOneBy({ ProductID: id });

        if (!updatedProduct) {
            return {
                message: "Product not found",
                code: 404
            };
        }

        return {
            data: updatedProduct
        };
    }

    @Delete("{id}")
    public async delete(
        @Path() id: number
    ): Promise<ApiResponseInfo> {

        await productRepo.softDelete(id);

        return {
            message: "Product removed"
        };
    }

}