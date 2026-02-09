import { Router } from 'express';
import { lineController } from '../controllers/lineController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get("/lines", [requireAuth, lineController.getAll]);
router.post("/lines", [requireAuth, lineController.create]);
router.put("/lines/:id", [requireAuth, lineController.update]);
router.delete("/lines/:id", [requireAuth, lineController.delete]);

export default router;