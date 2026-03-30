import { AppDataSource } from "../../../../config/data-source";
import { ALAssLineWStationAllocation } from "../../../../entity/ALAssLineWStationAllocation";
import { ApiError, ApiResponse, ApiResponseInfo, ApiResponseSingle } from "../../../../../shared/api/ApiResponse";
import { Controller, Get, Route, Query, Tags, Post, Body, Patch, Delete, Request, Path } from "tsoa";
import { ApiRequest } from "@shared/api/ApiRequest";
import { GetAllocationSchema, GetAllocationsSchema, PatchAllocationsSchema, PostAllocationsSchema } from "@shared/api/allocation/schema";
import { AllocationMapper } from "./allocation/mapper";
import { FindOptionsWhere, Like, FindManyOptions } from "typeorm";

const allocationRepo = AppDataSource.getRepository(ALAssLineWStationAllocation);

@Route("api/allocations")
@Tags("Allocations")
export class AllocationController extends Controller {

    @Get("")
    public async getAll(
        @Query() page = 0,
        @Query() size = 10,
        @Query() filter?: string
    ): Promise<ApiResponse<GetAllocationsSchema>> {

        const where: FindOptionsWhere<ALAssLineWStationAllocation> = {};

        const options: FindManyOptions<ALAssLineWStationAllocation> = {
            skip: (page > 0 ? page - 1 : 0) * size,
            take: size,
            order: {
                ALAssLineWStationAllocationID: "DESC"
            },
            relations: { assemblyLine: { product: true }, workstation: true },
            where,
        }

        const items = await allocationRepo.find(options);
        const total = await allocationRepo.count(options);
        const output = AllocationMapper.toGetAllocationsSchema({
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
    ): Promise<ApiResponseSingle<GetAllocationSchema> | ApiError> {
        const item = await allocationRepo.findOne({ 
            where: { ALAssLineWStationAllocationID: id },
            relations: { assemblyLine: { product: true }, workstation: true }
        });
        if (!item) {
            return {
                message: "Allocation not found",
                code: 404
            };
        }
        return AllocationMapper.toGetAllocationSchema(item);
    }

    @Post("")
    public async create(
        @Body() body: PostAllocationsSchema,
        @Request() req: ApiRequest
    ): Promise<ApiResponse<ALAssLineWStationAllocation>> {

        const { ALAssLineID, ALWStationID } = body;
        const user = req.user;

        if (!ALAssLineID) {
            return {
                message: "ALAssLineID is required",
                code: 400
            };
        }

        if (!ALWStationID) {
            return {
                message: "ALWStationID is required",
                code: 400
            };
        }

        try {
            const maxSortResult = await allocationRepo
                .createQueryBuilder("alloc")
                .select("MAX(alloc.Sort)", "max")
                .where("alloc.ALAssLineID = :lineId", { lineId: ALAssLineID })
                .getRawOne();

            const nextSort = (maxSortResult.max || 0) + 1;

            const newAlloc = allocationRepo.create({
                ALAssLineID,
                ALWStationID,
                Sort: nextSort
            });

            await allocationRepo.save(newAlloc, {
                data: { userEmail: user?.userEmail }
            });
            return { data: newAlloc };
        } catch (error: any) {
            return {
                message: "Błąd alokacji",
                code: 500,
                stack: `${error.stack}`,
            };
        }
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: PatchAllocationsSchema,
    ): Promise<ApiResponse<ALAssLineWStationAllocation>> {

        await allocationRepo.update(id, body);

        const updatedAlloc = await allocationRepo.findOneBy({ ALAssLineWStationAllocationID: id });

        if (!updatedAlloc) {
            return {
                message: "Allocation not found",
                code: 404
            };
        }

        return {
            data: updatedAlloc
        };
    }

    @Delete("{id}")
    public async delete(
        @Path() id: number
    ): Promise<ApiResponseInfo> {

        await allocationRepo.softDelete(id);

        return {
            message: "Allocation deleted"
        };
    }

    @Delete("")
    public async deleteAll(
        @Query() ids: number[]
    ): Promise<ApiResponseInfo> {

        await allocationRepo.softDelete(ids);

        return {
            message: "Allocations deleted"
        };
    }

}