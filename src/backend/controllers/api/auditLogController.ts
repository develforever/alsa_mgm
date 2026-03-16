import { AppDataSource } from "../../config/data-source";
import { AuditLog } from "../../entity/AuditLog";
import { ApiResponseList } from "../../../shared/api/ApiResponse";

const auditRepo = AppDataSource.getRepository(AuditLog);

import { Controller, Get, Route, Query, Tags } from "tsoa";

@Route("api/audit")
@Tags("AuditLogs")
export class AuditLogController extends Controller {

    @Get("logs")
    public async getAuditLogs(
        @Query() page = 0,
        @Query() size = 10
    ): Promise<ApiResponseList<AuditLog>> {

        const logs = await auditRepo.find({
            order: { timestamp: "DESC" },
            skip: page * size,
            take: size,
        });

        const total = await auditRepo.count();

        return {
            data: logs,
            meta: {
                page,
                limit: size,
                total,
            }
        };
    }
}