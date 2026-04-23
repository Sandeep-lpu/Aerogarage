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

/**
 * @swagger
 * /client/profile:
 *   get:
 *     summary: Get client profile
 *     tags: [Client]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Client profile data
 *   patch:
 *     summary: Update client profile
 *     tags: [Client]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
clientRouter.get("/profile", getClientProfileController);
clientRouter.patch("/profile", updateClientProfileValidator, validateRequest, updateClientProfileController);

/**
 * @swagger
 * /client/documents:
 *   get:
 *     summary: List documents scoped to this client
 *     tags: [Client]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of documents
 */
clientRouter.get("/documents", listClientDocumentsController);

/**
 * @swagger
 * /client/requests:
 *   get:
 *     summary: List all service requests submitted by this client
 *     tags: [Client]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of service requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ServiceRequest'
 *   post:
 *     summary: Submit a new service request
 *     tags: [Client]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, serviceType, description]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Deep clean — Gate 7B"
 *               serviceType:
 *                 type: string
 *                 enum: ["Aircraft Cleaning","PBB Operations","Surface Transportation","Line Maintenance","Aircraft Security","Repair Shop"]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *               description:
 *                 type: string
 *                 minLength: 20
 *     responses:
 *       201:
 *         description: Request created
 *       400:
 *         description: Validation error
 */
clientRouter.get("/requests", listClientRequestsController);
clientRouter.post("/requests", createClientRequestValidator, validateRequest, createClientRequestController);

export default clientRouter;
