import { Router } from "express";

const clientRouter = Router();

clientRouter.get("/health", (req, res) => {
  res.success({ module: "client" }, "Client module healthy");
});

export default clientRouter;
