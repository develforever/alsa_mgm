import { AppDataSource } from "../../config/data-source";
import { ApiResponse, ApiResponseInfo } from "../../../shared/api/ApiResponse";
import { Controller, Get, Route, Query, Tags, Post, Body, Patch, Delete, Request, Path } from "tsoa";
import { Product } from "../../entity/Product";

const productRepo = AppDataSource.getRepository(Product);

@Route("api/products")
@Tags("Products")
export class ProductController extends Controller {

    @Get("")
    public async getAll(
        @Query() page: number = 0,
        @Query() size: number = 10
    ): Promise<ApiResponse<Product[]>> {
        const lines = await productRepo.find({
            skip: page * size,
            take: size,
        });
        const total = await productRepo.count();
        return {
            data: lines,
            total,
        };
    }

    @Post("")
    public async create(
        @Body() body: { Name: string, Active: number },
        @Request() req: any
    ): Promise<ApiResponse<Product>> {
        const { Name, Active } = body;
        if (!Name) {
            return {
                message: "Name is required",
                code: 400
            };
        }
        const newProduct = productRepo.create({ Name, Active: Active ?? 1 });


        await productRepo.save(newProduct, {
            data: { userEmail: req.user?.userEmail }
        });
        return { data: newProduct };
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: { Name: string, Active: number },
        @Request() req: any
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
        @Path() id: number,
        @Request() req: any
    ): Promise<ApiResponseInfo> {

        await productRepo.softDelete(id);

        return {
            message: "Product removed"
        };
    }

}