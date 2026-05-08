import { AppDataSource } from "../../../../config/data-source";
import { Route, Tags, Get, Post, Patch, Delete, Query, Path, Body, Request } from "tsoa";
import { ALAssLine, ALAssLineStatus } from "../../../../entity/ALAssLine";
import { GetLineSchema, PostLinesSchema, PatchLinesSchema } from "@shared/api/line/schema";
import { ApiRequest } from "@shared/api/ApiRequest";
import { BaseCrudController, CrudOptions } from "../../../BaseCrudController";

const lineRepo = AppDataSource.getRepository(ALAssLine);

@Route("api/lines")
@Tags("Lines")
export class LineController extends BaseCrudController<ALAssLine, PostLinesSchema, PatchLinesSchema, GetLineSchema> {
    
    protected getRepository() {
        return lineRepo;
    }

    protected getOptions(): CrudOptions<ALAssLine> {
        return {
            filterableColumns: ["Name"],
            defaultSort: { column: "ALAssLineID", order: "DESC" },
            primaryKey: "ALAssLineID",
            entityName: "Line"
        };
    }

    protected toResponseDto(entity: ALAssLine): GetLineSchema {
        return {
            ALAssLineID: entity.ALAssLineID,
            ProductID: entity.ProductID,
            Name: entity.Name,
            Status: entity.Status,
            CreatedAt: entity.createdAt,
            UpdatedAt: entity.updatedAt,
        };
    }

    protected toSingleResponseDto(entity: ALAssLine): GetLineSchema {
        return this.toResponseDto(entity);
    }

    protected createEntity(dto: PostLinesSchema): ALAssLine {
        return lineRepo.create({
            ProductID: dto.ProductID,
            Name: dto.Name,
            Status: dto.Status ?? ALAssLineStatus.Active
        });
    }

    protected validateCreate(dto: PostLinesSchema): string | null {
        if (!dto.Name) {
            return "Name is required";
        }
        return null;
    }

    protected validateUpdate(): string | null {
        return null;
    }

    @Get("")
    public async getAllLines(@Query() page = 0, @Query() size = 10, @Query() filter?: string) {
        return super.getAll(page, size, filter);
    }

    @Get("{id}")
    public async getLine(@Path() id: number) {
        return super.getOne(id);
    }

    @Post("")
    public async createLine(@Body() body: PostLinesSchema, @Request() req: ApiRequest) {
        return super.create(body, req);
    }

    @Patch("{id}")
    public async updateLine(@Path() id: number, @Body() body: PatchLinesSchema) {
        return super.update(id, body);
    }

    @Delete("{id}")
    public async deleteLine(@Path() id: number) {
        return super.delete(id);
    }
}