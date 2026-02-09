import "reflect-metadata";
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import appRoutes from './routes/appRoutes';
import { authMiddleware } from "./middlewares/auth";
import productRoutes from "./routes/productRoutes";
import lineRoutes from "./routes/lineRoutes";
import workstationRoutes from "./routes/workstationRoutes";
import allocationRoutes from "./routes/allocationRoutes";
import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

app.use('/api', authMiddleware);

// Routes
app.use('/', appRoutes);
app.use('/api', productRoutes);
app.use('/api', lineRoutes);
app.use('/api', workstationRoutes);
app.use('/api', allocationRoutes);

const publicPath = path.join(__dirname, '../../public/browser');

app.use(express.static('public/browser'));

app.get('/{*any}', (req, res) => {
    
    res.sendFile('index.html', { root: __dirname + '/../../public/browser' });
});

app.use(errorHandler);

export default app;