import { AppDataSource } from "../../../../config/data-source";
import { AuditLog } from "../../../../entity/AuditLog";
import { ApiResponseList } from "../../../../../shared/api/ApiResponse";
import { escapeLikeWildcards, isSafeFilterInput } from "../../../../utils/filter.utils";

const auditRepo = AppDataSource.getRepository(AuditLog);

import { Controller, Get, Route, Query, Tags } from "tsoa";
import { FindOptionsWhere, Like, Between } from "typeorm";

@Route("api/audit")
@Tags("AuditLogs")
export class AuditLogController extends Controller {

    @Get("logs")
    public async getAuditLogs(
        @Query() page = 0,
        @Query() size = 10,
        @Query() entityName?: string,
        @Query() action?: string,
        @Query() userEmail?: string,
        @Query() dateFrom?: string,
        @Query() dateTo?: string
    ): Promise<ApiResponseList<AuditLog>> {

        const where: FindOptionsWhere<AuditLog> = {};

        // Apply filters
        if (entityName) {
            where.entityName = entityName;
        }
        if (action) {
            where.action = action;
        }
        if (userEmail && isSafeFilterInput(userEmail)) {
            where.userEmail = Like(`%${escapeLikeWildcards(userEmail)}%`);
        }

        // Date range filtering
        if (dateFrom || dateTo) {
            const fromDate = dateFrom ? new Date(dateFrom) : new Date(0);
            const toDate = dateTo ? new Date(dateTo) : new Date();
            
            // Validate dates
            if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
                where.timestamp = Between(fromDate, toDate);
            }
        }

        const [logs, total] = await auditRepo.findAndCount({
            where,
            order: { timestamp: "DESC" },
            skip: page * size,
            take: size,
        });

        return {
            data: logs,
            meta: {
                page,
                limit: size,
                total,
            }
        };
    }

    @Get("entities")
    public async getEntityNames(): Promise<string[]> {
        const results = await auditRepo
            .createQueryBuilder("audit")
            .select("DISTINCT audit.entityName", "entityName")
            .getRawMany();
        
        return results.map(r => r.entityName).filter(Boolean);
    }

    @Get("actions")
    public async getActions(): Promise<string[]> {
        const results = await auditRepo
            .createQueryBuilder("audit")
            .select("DISTINCT audit.action", "action")
            .getRawMany();
        
        return results.map(r => r.action).filter(Boolean);
    }
}