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
import passport from "passport";
import session from "express-session";
import './config/passport';
import config from "./config/config";

const app = express();

app.use(express.json());
app.use(session({ secret: 'transmar-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/api/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: `${config.BASE_URL}/login` }),
  (req, res) => {
    // Po udanym logowaniu przekieruj na frontend
    res.redirect(`${config.BASE_URL}/allocations`);
  }
);

app.get('/api/auth/status', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});
    
app.use('/api', authMiddleware);

// Routes
app.use('/', appRoutes);
app.use('/api', productRoutes);
app.use('/api', lineRoutes);
app.use('/api', workstationRoutes);
app.use('/api', allocationRoutes);

const publicPath = path.join(__dirname, '../../public/browser');

app.use(express.static(publicPath));

app.get('/{*any}', (req, res) => {
    
    res.sendFile('index.html', { root: publicPath });
});

app.use(errorHandler);

export default app;