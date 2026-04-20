import swaggerJsdoc from "swagger-jsdoc";
import { APP_NAME } from "./constants.js";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Aerogarage API",
      version: "1.0.0",
      description:
        "Enterprise aviation ground-handling services API. Powers the Client Portal, Employee Portal, Training Portal, and Admin System.",
      contact: {
        name: "Aerogarage Engineering",
        email: "engineering@aerogarage.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "Current server",
      },
      {
        url: "https://api.aerogarage.com/api",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token obtained from POST /api/auth/login",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
            errors: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            fullName: { type: "string", example: "Ahmed Al-Rashid" },
            email: { type: "string", example: "ahmed@airline.com" },
            role: {
              type: "string",
              enum: ["client", "employee", "staff", "admin"],
            },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@aerogarage.com" },
            password: { type: "string", minLength: 8, example: "Secret@123" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", example: "Ahmed Al-Rashid" },
            email: { type: "string", format: "email", example: "ahmed@airline.com" },
            password: { type: "string", minLength: 8, example: "Secret@123" },
          },
        },
        ServiceRequest: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string", example: "Aircraft Deep Clean — Gate 12" },
            serviceType: {
              type: "string",
              enum: [
                "Aircraft Cleaning",
                "PBB Operations",
                "Surface Transportation",
                "Line Maintenance",
                "Aircraft Security",
                "Repair Shop",
              ],
            },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            status: {
              type: "string",
              enum: [
                "submitted",
                "reviewing",
                "in_progress",
                "completed",
                "cancelled",
              ],
            },
            description: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    tags: [
      { name: "Health", description: "Service status and liveness probes" },
      { name: "Auth", description: "Authentication — login, register, refresh, logout" },
      { name: "Client", description: "Client portal — service requests, documents, profile" },
      { name: "Employee", description: "Employee portal — work items, tasks, documents, profile" },
      { name: "Training", description: "Training portal — modules, exams, resources" },
      { name: "Admin", description: "Admin system — users, requests, approvals, content" },
      { name: "Public", description: "Public APIs — contact inquiries, careers, content" },
    ],
  },
  // Glob pattern to find all files containing @swagger JSDoc annotations
  apis: ["./src/routes/*.js", "./server.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerUiOptions = {
  customSiteTitle: "Aerogarage API Docs",
  customCss: `
    .swagger-ui .topbar { background-color: #0f2b46; }
    .swagger-ui .topbar-wrapper .link { display: none; }
    .swagger-ui .topbar-wrapper::after {
      content: 'AEROGARAGE API';
      color: #ffffff;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
    }
  `,
};

export const APP_VERSION = "1.0.0";
