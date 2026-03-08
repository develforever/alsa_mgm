import "reflect-metadata";
import express, { Request as ExRequest, Response as ExResponse, NextFunction } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import path from "path";
import passport from "passport";
import session from "express-session";
import './config/passport';
import { RegisterRoutes } from "../shared/generated/routes";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import config from "./config/config";

const app = express();

app.use(express.json());
app.use(session({ secret: config.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const publicPath = path.join(__dirname, '../../public/browser');

app.use(express.static(publicPath));

app.use("/api/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../shared/generated/swagger.json"))
  );
});

RegisterRoutes(app);

app.use(function handleTsoaError(err: any, req: ExRequest, res: ExResponse, next: NextFunction) {
  if (err instanceof ValidateError) {
    console.warn(`Błąd walidacji dla ${req.path}:`, err.fields);
    return res.status(400).json({
      message: "Błąd walidacji danych",
      details: err.fields,
    });
  }
  next(err);
});

app.get('/{*any}', (req, res) => {
  res.sendFile('index.html', { root: publicPath });
});


app.use(errorHandler);

export default app;