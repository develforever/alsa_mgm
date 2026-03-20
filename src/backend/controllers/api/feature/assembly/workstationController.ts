import { ApiResponse, ApiResponseInfo, ApiResponseList } from "@shared/api/ApiResponse";
import { AppDataSource } from "../../../../config/data-source";
import { ALWStation } from "../../../../entity/ALWStation";
import { Body, Controller, Delete, Get, Patch, Path, Post, Query, Route, Tags } from "tsoa";

const stationRepo = AppDataSource.getRepository(ALWStation);

@Route("api/workstations")
@Tags("Workstations")
export class WorkstationController extends Controller {

    @Get("")
    public async getAll(
        @Query() page = 0,
        @Query() size = 10
    ): Promise<ApiResponseList<ALWStation>> {
        const stations = await stationRepo.find({
            skip: page * size,
            take: size,
        });
        const total = await stationRepo.count();
        return {
            data: stations,
            meta: {
                page,
                limit: size,
                total,
            }
        };
    }

    @Post("")
    public async create(
        @Body() body: { Name: string, ShortName: string, PCName: string },
    ): Promise<ApiResponse<ALWStation>> {
        const station = stationRepo.create(body);
        await stationRepo.save(station);
        return { data: station };
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: { Name: string, ShortName: string, PCName: string },
    ): Promise<ApiResponse<ALWStation>> {
        await stationRepo.update(id, body);

        const updatedStation = await stationRepo.findOneBy({ ALWStationID: id });

        if (!updatedStation) {
            return {
                message: "Workstation not found",
                code: 404
            };
        }

        return { data: updatedStation };
    }

    @Delete("{id}")
    public async delete(
        @Path() id: number,
    ): Promise<ApiResponseInfo> {
        await stationRepo.softDelete(id);
        return { message: "Workstations soft-deleted" };
    }

}
