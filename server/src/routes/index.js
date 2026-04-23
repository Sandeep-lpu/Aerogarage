import { Router } from "express";
import { APP_NAME } from "../config/constants.js";
import authRouter from "./auth.routes.js";
import publicRouter from "./public.routes.js";
import clientRouter from "./client.routes.js";
import trainingRouter from "./training.routes.js";
import adminRouter from "./admin.routes.js";
import employeeRouter from "./employee.routes.js";
import notificationRouter from "./notification.routes.js";
import analyticsRouter from "./analytics.routes.js";

const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.success({ service: APP_NAME }, "API healthy");
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/public", publicRouter);
apiRouter.use("/client", clientRouter);
apiRouter.use("/training", trainingRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/employee", employeeRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/analytics", analyticsRouter);

export default apiRouter;
