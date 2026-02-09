import * as dotenv from 'dotenv';
dotenv.config();
import config from './config/config';
import app from './app';

import { AppDataSource } from "./config/data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
