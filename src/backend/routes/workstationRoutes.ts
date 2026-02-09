import { Router } from 'express';
import { workstationController } from '../controllers/workstationController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get("/workstations", [requireAuth, workstationController.getAll]);
router.post("/workstations", [requireAuth, workstationController.create]);
router.put("/workstations/:id", [requireAuth, workstationController.update]);
router.delete("/workstations/:id", [requireAuth, workstationController.delete]);

export default router;