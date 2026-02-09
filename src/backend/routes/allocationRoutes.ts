import { Router } from 'express';
import { allocationController } from '../controllers/allocationController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get("/allocations", [requireAuth, allocationController.getAll]);
router.post("/allocations", [requireAuth, allocationController.create]);
router.put("/allocations/:id", [requireAuth, allocationController.update]);
router.delete("/allocations/:id", [requireAuth, allocationController.delete]);
router.post("/allocations/delete-multiple", [requireAuth, allocationController.deleteMultiple]);

export default router;