import { Router } from 'express';
import { workstationController } from '../controllers/workstationController';

const router = Router();

router.get("/workstations", workstationController.getAll);
router.post("/workstations", workstationController.create);
router.put("/workstations/:id", workstationController.update);
router.delete("/workstations/:id", workstationController.delete);

export default router;