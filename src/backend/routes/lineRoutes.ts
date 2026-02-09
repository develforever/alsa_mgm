import { Router } from 'express';
import { lineController } from '../controllers/lineController';

const router = Router();

router.get("/lines", lineController.getAll);
router.post("/lines", lineController.create);
router.put("/lines/:id", lineController.update);
router.delete("/lines/:id", lineController.delete);

export default router;