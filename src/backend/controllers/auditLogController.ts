import { AppDataSource } from "../config/data-source";
import { AuditLog } from "../entity/AuditLog";

const auditRepo = AppDataSource.getRepository(AuditLog);

export const auditLogController = {
    
    getAll: async (req:any, res:any) => {
        const logs = await auditRepo.find({
            order: { timestamp: "DESC" }
        });
        res.json(logs);
    },

};