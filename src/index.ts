import express, { Application } from "express";
import { json } from "body-parser";

const app: Application = express();
app.use(json());

export default app;
