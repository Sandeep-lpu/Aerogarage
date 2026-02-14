import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/auth.middleware.js";
import {
  createClientRequestController,
  getClientProfileController,
  listClientDocumentsController,
  listClientRequestsController,
  updateClientProfileController,
} from "../modules/client/controllers/client.controller.js";
import {
  createClientRequestValidator,
  updateClientProfileValidator,
  validateRequest,
} from "../modules/client/validators/client.validators.js";

const clientRouter = Router();

clientRouter.use(requireAuth, requireRoles("client", "staff", "admin"));

clientRouter.get("/health", (req, res) => {
  res.success({ module: "client", role: req.user.role }, "Client module healthy");
});

clientRouter.get("/profile", getClientProfileController);
clientRouter.patch("/profile", updateClientProfileValidator, validateRequest, updateClientProfileController);

clientRouter.get("/documents", listClientDocumentsController);

clientRouter.get("/requests", listClientRequestsController);
clientRouter.post("/requests", createClientRequestValidator, validateRequest, createClientRequestController);

export default clientRouter;
