import { AppDataSource } from "../../../../config/data-source";
import { ApiError, ApiResponse, ApiResponseInfo, ApiResponseSingle } from "../../../../../shared/api/ApiResponse";
import { Controller, Get, Route, Query, Tags, Post, Body, Patch, Delete, Request, Path } from "tsoa";
import { ALWStation } from "../../../../entity/ALWStation";
import { ApiRequest } from "@shared/api/ApiRequest";
import { GetWorkstationSchema, GetWorkstationsSchema, PatchWorkstationsSchema, PostWorkstationsSchema } from "@shared/api/workstation/schema";
import { WorkstationMapper } from "./workstation/mapper";
import { FindOptionsWhere, Like, FindManyOptions } from "typeorm";
import { sanitizeLikeFilter } from "../../../../utils/filter.utils";

const workstationRepo = AppDataSource.getRepository(ALWStation);

@Route("api/workstations")
@Tags("Workstations")
export class WorkstationController extends Controller {

    @Get("")
    public async getAll(
        @Query() page = 0,
        @Query() size = 10,
        @Query() filter?: string
    ): Promise<ApiResponse<GetWorkstationsSchema>> {

        const where: FindOptionsWhere<ALWStation> = {};

        const sanitizedFilter = sanitizeLikeFilter(filter);
        if (sanitizedFilter) {
            where.Name = Like(`%${sanitizedFilter}%`);
        }

        const options: FindManyOptions<ALWStation> = {
            skip: (page > 0 ? page - 1 : 0) * size,
            take: size,
            order: {
                ALWStationID: "DESC"
            },
            where,
        }

        const items = await workstationRepo.find(options);
        const total = await workstationRepo.count(options);
        const output = WorkstationMapper.toGetWorkstationsSchema({
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
    ): Promise<ApiResponseSingle<GetWorkstationSchema> | ApiError> {
        const item = await workstationRepo.findOneBy({ ALWStationID: id });
        if (!item) {
            return {
                message: "Workstation not found",
                code: 404
            };
        }
        return WorkstationMapper.toGetWorkstationSchema(item);
    }

    @Post("")
    public async create(
        @Body() body: PostWorkstationsSchema,
        @Request() req: ApiRequest
    ): Promise<ApiResponse<ALWStation>> {

        const { Name, ShortName, PCName, AutoStart } = body;
        const user = req.user;

        if (!Name) {
            return {
                message: "Name is required",
                code: 400
            };
        }

        if (!ShortName) {
            return {
                message: "ShortName is required",
                code: 400
            };
        }

        const newWorkstation = workstationRepo.create({ 
            Name, 
            ShortName, 
            PCName, 
            AutoStart: AutoStart ?? 0 
        });

        await workstationRepo.save(newWorkstation, {
            data: { userEmail: user?.userEmail }
        });
        return { data: newWorkstation };
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: PatchWorkstationsSchema,
    ): Promise<ApiResponse<ALWStation>> {

        await workstationRepo.update(id, body);

        const updatedWorkstation = await workstationRepo.findOneBy({ ALWStationID: id });

        if (!updatedWorkstation) {
            return {
                message: "Workstation not found",
                code: 404
            };
        }

        return {
            data: updatedWorkstation
        };
    }

    @Delete("{id}")
    public async delete(
        @Path() id: number
    ): Promise<ApiResponseInfo> {

        await workstationRepo.softDelete(id);

        return {
            message: "Workstation removed"
        };
    }

}
