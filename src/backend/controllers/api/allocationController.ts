import { AppDataSource } from "../../config/data-source";
import { ALAssLineWStationAllocation } from "../../entity/ALAssLineWStationAllocation";
import { ApiResponse } from "../../../shared/api/ApiResponse";

const allocationRepo = AppDataSource.getRepository(ALAssLineWStationAllocation);

import { Controller, Get, Route, Query, Tags, Post, Body } from "tsoa";

@Route("api/allocation")
@Tags("Allocations")
export class AllocationController extends Controller {

    @Get("list")
    public async getAllocations(
        @Query() page: number = 0,
        @Query() size: number = 10
    ): Promise<ApiResponse<ALAssLineWStationAllocation>> {

        const lines = await allocationRepo.find({
            relations: { assemblyLine: true, workstation: true },
            skip: page * size,
            take: size,
        });
        const total = await allocationRepo.count();
        return {
            data: lines,
            total,
        };
    }

    @Post("create")
    public async createAllocation(
        @Body() body: ALAssLineWStationAllocation
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
}