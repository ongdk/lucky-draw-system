import dotenv from "dotenv";
//For env File
dotenv.config();

import express, { Application } from "express";
import prizeController from "./controllers/prizeController";
import bodyParser from "body-parser";
import { scheduleJob } from "node-schedule";

import Postgres from "./db/Postgres";
import Redis from "./db/Redis";
import LuckyDrawService from "./services/LuckyDrawService";

const app: Application = express().use(bodyParser.json());
const port = process.env.PORT || 8000;

app.use("/", prizeController);

// first test connections to Postgres and Redis
// then refresh daily prize quotas
Promise.all([Postgres.connect(), Redis.connect()])
  .then(LuckyDrawService.refreshQuotas)
  .then(() => {
    // schedule prize quotas to refresh at midnight everyday
    scheduleJob("0 0 * * *", LuckyDrawService.refreshQuotas);
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  });
