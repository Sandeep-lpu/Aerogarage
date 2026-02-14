import { Router } from "express";

const adminRouter = Router();

adminRouter.get("/health", (req, res) => {
  res.success({ module: "admin" }, "Admin module healthy");
});

export default adminRouter;
