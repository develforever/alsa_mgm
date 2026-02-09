import { Router } from 'express';
import { auditLogController } from '../controllers/auditLogController';

const router = Router();

router.get("/audit-logs", auditLogController.getAll);

export default router;