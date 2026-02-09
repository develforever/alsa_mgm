import { Router } from 'express';
import { appHome } from '../controllers/appController';

const router = Router();

router.get('/app', appHome);


export default router;