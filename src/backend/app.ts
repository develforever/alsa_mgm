import "reflect-metadata";
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import appRoutes from './routes/appRoutes';
import { authMiddleware } from "./middlewares/auth";
import path from "path/win32";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

app.use('/api', authMiddleware);

// Routes
app.use('/', appRoutes);

const publicPath = path.join(__dirname, '../../public/browser');

app.use(express.static('public/browser'));

app.get('/{*any}', (req, res) => {
    
    res.sendFile('index.html', { root: __dirname + '/../../public/browser' });
});

app.use(errorHandler);

export default app;