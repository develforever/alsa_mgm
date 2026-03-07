import { AppDataSource } from "../config/data-source";
import { AuditLog } from "../entity/AuditLog";

const auditRepo = AppDataSource.getRepository(AuditLog);

export const auditLogController = {

    getAll: async (req: any, res: any) => {

        const pageIndex = parseInt(req.query.pageIndex) || 0;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const logs = await auditRepo.find({
            order: { timestamp: "DESC" },
            skip: pageIndex * pageSize,
            take: pageSize,
        });

        const total = await auditRepo.count();

        res.json({
            data: logs,
            total,
        });
    },

};