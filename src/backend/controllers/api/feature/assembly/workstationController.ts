import { AppDataSource } from "../../../../config/data-source";
import { Route, Tags, Get, Post, Patch, Delete, Query, Path, Body, Request } from "tsoa";
import { ALWStation } from "../../../../entity/ALWStation";
import { GetWorkstationSchema, PostWorkstationsSchema, PatchWorkstationsSchema } from "@shared/api/workstation/schema";
import { ApiRequest } from "@shared/api/ApiRequest";
import { BaseCrudController, CrudOptions } from "../../../BaseCrudController";

const workstationRepo = AppDataSource.getRepository(ALWStation);

@Route("api/workstations")
@Tags("Workstations")
export class WorkstationController extends BaseCrudController<ALWStation, PostWorkstationsSchema, PatchWorkstationsSchema, GetWorkstationSchema> {
    
    protected getRepository() {
        return workstationRepo;
    }

    protected getOptions(): CrudOptions<ALWStation> {
        return {
            filterableColumns: ["Name", "ShortName"],
            defaultSort: { column: "ALWStationID", order: "DESC" },
            primaryKey: "ALWStationID",
            entityName: "Workstation"
        };
    }

    protected toResponseDto(entity: ALWStation): GetWorkstationSchema {
        return {
            ALWStationID: entity.ALWStationID,
            Name: entity.Name,
            ShortName: entity.ShortName,
            PCName: entity.PCName,
            AutoStart: entity.AutoStart,
            CreatedAt: entity.createdAt,
            UpdatedAt: entity.updatedAt,
        };
    }

    protected toSingleResponseDto(entity: ALWStation): GetWorkstationSchema {
        return this.toResponseDto(entity);
    }

    protected createEntity(dto: PostWorkstationsSchema): ALWStation {
        return workstationRepo.create({
            Name: dto.Name,
            ShortName: dto.ShortName,
            PCName: dto.PCName,
            AutoStart: dto.AutoStart !== undefined ? dto.AutoStart : false
        });
    }

    protected validateCreate(dto: PostWorkstationsSchema): string | null {
        if (!dto.Name) {
            return "Name is required";
        }
        if (!dto.ShortName) {
            return "ShortName is required";
        }
        return null;
    }

    protected validateUpdate(): string | null {
        return null;
    }

    @Get("")
    public async getAllWorkstations(@Query() page = 0, @Query() size = 10, @Query() filter?: string) {
        return super.getAll(page, size, filter);
    }

    @Get("{id}")
    public async getWorkstation(@Path() id: number) {
        return super.getOne(id);
    }

    @Post("")
    public async createWorkstation(@Body() body: PostWorkstationsSchema, @Request() req: ApiRequest) {
        return super.create(body, req);
    }

    @Patch("{id}")
    public async updateWorkstation(@Path() id: number, @Body() body: PatchWorkstationsSchema) {
        return super.update(id, body);
    }

    @Delete("{id}")
    public async deleteWorkstation(@Path() id: number) {
        return super.delete(id);
    }
}
