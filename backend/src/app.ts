import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./modules/auth/auth.route.js";
import organizationRouter from "./modules/organizations/organization.route.js";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import membershipRouter from "./modules/membership/membership.route.js";
export const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Team Access Control API is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organization", organizationRouter);
app.use("/api/v1/membership", membershipRouter);
app.use(globalErrorHandler);
