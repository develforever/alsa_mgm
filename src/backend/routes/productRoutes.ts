import { Router } from 'express';
import { productController } from '../controllers/productController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get("/products", [requireAuth, productController.getAll]);
router.post("/products", [requireAuth, productController.create]);
router.put("/products/:id", [requireAuth, productController.update]);
router.delete("/products/:id", [requireAuth, productController.delete]);


export default router;