import { Router } from 'express';
import { allocationController } from '../controllers/allocationController';

const router = Router();

router.get("/allocations", allocationController.getAll);
router.post("/allocations", allocationController.create);
router.put("/allocations/:id", allocationController.update);
router.delete("/allocations/:id", allocationController.delete);
router.post("/allocations/delete-multiple", allocationController.deleteMultiple);

export default router;