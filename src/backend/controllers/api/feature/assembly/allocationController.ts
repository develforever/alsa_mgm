import { AppDataSource } from "../../../../config/data-source";
import { ALAssLineWStationAllocation } from "../../../../entity/ALAssLineWStationAllocation";
import { ApiResponse, ApiResponseInfo, ApiResponseList } from "../../../../../shared/api/ApiResponse";

const allocationRepo = AppDataSource.getRepository(ALAssLineWStationAllocation);

import { Controller, Get, Route, Query, Tags, Post, Body, Patch, Delete, Path } from "tsoa";

@Route("api/allocations")
@Tags("Allocations")
export class AllocationController extends Controller {

    @Get("")
    public async getAllocations(
        @Query() page = 0,
        @Query() size = 10
    ): Promise<ApiResponseList<ALAssLineWStationAllocation>> {

        const lines = await allocationRepo.find({
            relations: { assemblyLine: true, workstation: true },
            skip: page * size,
            take: size,
        });
        const total = await allocationRepo.count();
        return {
            data: lines,
            meta: {
                page,
                limit: size,
                total,
            }
        };
    }

    @Post("")
    public async createAllocation(
        @Body() body: { ALAssLineID: number, ALWStationID: number }
    ): Promise<ApiResponse<ALAssLineWStationAllocation>> {
        const { ALAssLineID, ALWStationID } = body;
        const repo = AppDataSource.getRepository(ALAssLineWStationAllocation);

        try {

            const maxSortResult = await repo
                .createQueryBuilder("alloc")
                .select("MAX(alloc.Sort)", "max")
                .where("alloc.ALAssLineID = :lineId", { lineId: ALAssLineID })
                .getRawOne();

            const nextSort = (maxSortResult.max || 0) + 1;

            const newAlloc = repo.create({
                ALAssLineID,
                ALWStationID,
                Sort: nextSort
            });

            await repo.save(newAlloc);
            return {
                data: newAlloc,
            };
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
        @Body() body: { ALAssLineID: number, ALWStationID: number, Sort: number }
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
            data: updatedAlloc,
        };

    }

    @Delete("{id}")
    public async delete(
        @Path() id: number
    ): Promise<ApiResponseInfo> {

        await allocationRepo.softDelete(id);

        return {
            message: "Allocation deleted"
        }
    }

    @Delete("")
    public async deleteAll(
        @Query() ids: number[]
    ): Promise<ApiResponseInfo> {

        await allocationRepo.softDelete(ids);

        return {
            message: "Allocations deleted"
        }
    }
}