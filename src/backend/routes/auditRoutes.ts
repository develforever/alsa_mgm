import { Router } from 'express';
import { auditLogController } from '../controllers/auditLogController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get("/audit-logs", [requireAuth, auditLogController.getAll]);

export default router;