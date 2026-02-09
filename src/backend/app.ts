import "reflect-metadata";
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import appRoutes from './routes/appRoutes';


const app = express();

app.use(express.json());

// Routes
app.use('/', appRoutes);

app.use(express.static('public/browser'));

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;