import { AppDataSource } from "../../../../config/data-source";
import { Route, Tags, Get, Post, Patch, Delete, Query, Path, Body, Request } from "tsoa";
import { Product } from "../../../../entity/Product";
import { GetProductSchema, PostProductsSchema, PatchProductsSchema } from "@shared/api/product/schema";
import { ApiRequest } from "@shared/api/ApiRequest";
import { BaseCrudController, CrudOptions } from "../../../BaseCrudController";

const productRepo = AppDataSource.getRepository(Product);

@Route("api/products")
@Tags("Products")
export class ProductController extends BaseCrudController<Product, PostProductsSchema, PatchProductsSchema, GetProductSchema> {
    
    protected getRepository() {
        return productRepo;
    }

    protected getOptions(): CrudOptions<Product> {
        return {
            filterableColumns: ["Name"],
            defaultSort: { column: "ProductID", order: "DESC" },
            primaryKey: "ProductID",
            entityName: "Product"
        };
    }

    protected toResponseDto(entity: Product): GetProductSchema {
        return {
            ProductID: entity.ProductID,
            Name: entity.Name,
            Active: entity.Active,
            CreatedAt: entity.createdAt,
            UpdatedAt: entity.updatedAt,
        };
    }

    protected toSingleResponseDto(entity: Product): GetProductSchema {
        return this.toResponseDto(entity);
    }

    protected createEntity(dto: PostProductsSchema): Product {
        return productRepo.create({
            Name: dto.Name,
            Active: dto.Active !== undefined ? dto.Active : true as unknown as boolean
        });
    }

    protected validateCreate(dto: PostProductsSchema): string | null {
        if (!dto.Name) {
            return "Name is required";
        }
        return null;
    }

    protected validateUpdate(): string | null {
        return null;
    }

    @Get("")
    public async getAllProducts(@Query() page = 0, @Query() size = 10, @Query() filter?: string) {
        return super.getAll(page, size, filter);
    }

    @Get("{id}")
    public async getProduct(@Path() id: number) {
        return super.getOne(id);
    }

    @Post("")
    public async createProduct(@Body() body: PostProductsSchema, @Request() req: ApiRequest) {
        return super.create(body, req);
    }

    @Patch("{id}")
    public async updateProduct(@Path() id: number, @Body() body: PatchProductsSchema) {
        return super.update(id, body);
    }

    @Delete("{id}")
    public async deleteProduct(@Path() id: number) {
        return super.delete(id);
    }
}