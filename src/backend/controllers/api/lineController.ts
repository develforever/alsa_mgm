import { AppDataSource } from "../../config/data-source";
import { ApiResponse } from "../../../shared/api/ApiResponse";

import { Controller, Get, Route, Query, Tags, Post, Body, Patch, Delete, Path } from "tsoa";
import { LineStatus } from "@shared/models/types";
import { ALAssLine } from "../../entity/ALAssLine";

const lineRepo = AppDataSource.getRepository(ALAssLine);

@Route("api/lines")
@Tags("Lines")
export class LineController extends Controller {

    @Get("")
    public async getAll(
        @Query() page: number = 0,
        @Query() size: number = 10
    ): Promise<ApiResponse<ALAssLine[]>> {
        const lines = await lineRepo.find({
            skip: page * size,
            take: size,
        });
        const total = await lineRepo.count();
        return {
            data: lines,
            total,
        };
    }

    @Post("")
    public async create(
        @Body() body: ALAssLine
    ): Promise<ApiResponse<ALAssLine>> {

        const { ProductID, Name, Status } = body;
        const newLine = lineRepo.create({
            ProductID,
            Name,
            Status: Status || LineStatus.Active
        });
        await lineRepo.save(newLine);
        return {
            data: newLine
        }
    }

    @Patch("{id}")
    public async update(
        @Path() id: number,
        @Body() body: ALAssLine
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
        }
    }

    @Delete("{id}")
    public async delete(
        @Path() id: number
    ) {

        await lineRepo.softDelete(id);
        return {
            message: "Line removed"
        }
    }

}