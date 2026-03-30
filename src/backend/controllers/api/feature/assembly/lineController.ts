import { AppDataSource } from "config/data-source";
import { ApiError, ApiResponse, ApiResponseInfo, ApiResponseSingle } from "../../../../../shared/api/ApiResponse";
import { Controller, Get, Route, Query, Tags, Post, Body, Patch, Delete, Request, Path } from "tsoa";
import { ALAssLine, ALAssLineStatus } from "entity/ALAssLine";
import { ApiRequest } from "@shared/api/ApiRequest";
import { GetLineSchema, GetLinesSchema, PatchLinesSchema, PostLinesSchema } from "@shared/api/line/schema";
import { LineMapper } from "./line/maper";
import { FindOptionsWhere, Like, FindManyOptions } from "typeorm";

const lineRepo = AppDataSource.getRepository(ALAssLine);

@Route("api/lines")
@Tags("Lines")
export class LineController extends Controller {

    @Get("")
    public async getAll(
        @Query() page = 0,
        @Query() size = 10,
        @Query() filter?: string
    ): Promise<ApiResponse<GetLinesSchema>> {

        const where: FindOptionsWhere<ALAssLine> = {};

        if (filter) {
            where.Name = Like(`%${filter}%`);
        }

        const options: FindManyOptions<ALAssLine> = {
            skip: (page > 0 ? page - 1 : 0) * size,
            take: size,
            order: {
                ALAssLineID: "DESC"
            },
            where,
        }

        const items = await lineRepo.find(options);
        const total = await lineRepo.count(options);
        const output = LineMapper.toGetLinesSchema({
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
    ): Promise<ApiResponseSingle<GetLineSchema> | ApiError> {
        const item = await lineRepo.findOneBy({ ALAssLineID: id });
        if (!item) {
            return {
                message: "Line not found",
                code: 404
            };
        }
        return LineMapper.toGetLineSchema(item);
    }

    @Post("")
    public async create(
        @Body() body: PostLinesSchema,
        @Request() req: ApiRequest
    ): Promise<ApiResponse<ALAssLine>> {

        const { ProductID, Name, Status } = body;
        const user = req.user;

        if (!Name) {
            return {
                message: "Name is required",
                code: 400
            };
        }
        const newLine = lineRepo.create({
            ProductID,
            Name,
            Status: Status ?? ALAssLineStatus.Active
        });

        await lineRepo.save(newLine, {
            data: { userEmail: user?.userEmail }
        });
        return { data: newLine };
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: PatchLinesSchema,
    ): Promise<ApiResponse<ALAssLine>> {

        await lineRepo.update(id, body);

        const updatedLine = await lineRepo.findOneBy({ ALAssLineID: id });

        if (!updatedLine) {
            return {
                message: "Line not found",
                code: 404
            };
        }

        return {
            data: updatedLine
        };
    }

    @Delete("{id}")
    public async delete(
        @Path() id: number
    ): Promise<ApiResponseInfo> {

        await lineRepo.softDelete(id);

        return {
            message: "Line removed"
        };
    }

}