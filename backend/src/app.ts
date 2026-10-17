import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.route.js";

export const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Team Access Control API is running" });
});

app.use("/api/v1/auth", authRouter);
