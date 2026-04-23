import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";

let io;

export async function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    },
  });

  // ── Redis adapter (optional) ──────────────────────────────────────────────
  // If Redis is not running we log a warning and fall back to the default
  // in-memory adapter so the server still starts cleanly in local dev.
  const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  try {
    const pubClient = createClient({ url: redisUrl, socket: { connectTimeout: 3000, reconnectStrategy: false } });
    const subClient = pubClient.duplicate();

    // Suppress unhandled error events — we handle them in the catch block
    pubClient.on("error", () => {});
    subClient.on("error", () => {});

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log("🟢 Socket.io Redis adapter connected");
  } catch {
    console.warn(
      "⚠️  Redis not available — Socket.io running with in-memory adapter (single-server only).\n" +
      "   Set REDIS_URL in .env or install Redis to enable the distributed adapter.",
    );
  }

  // ── Auth middleware ───────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(payload.sub || payload.id).select("email role isActive");

      if (!user || !user.isActive) {
        return next(new Error("Authentication error: Invalid or inactive user"));
      }

      socket.user = user;
      next();
    } catch {
      next(new Error("Authentication error: Token validation failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (${socket.user.email} / ${socket.user.role})`);
    socket.join(`role:${socket.user.role}`);
    socket.join(`user:${socket.user._id.toString()}`);
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketServer() {
  if (!io) throw new Error("Socket.io server not initialized");
  return io;
}

/** Emits an event to a specific user and all admins. */
export function emitToUserAndAdmins(event, userId, data) {
  if (!io) return;
  io.to(`user:${userId.toString()}`).emit(event, data);
  io.to("role:admin").emit(event, data);
}

/** Emits an event to a specific role. */
export function emitToRole(event, role, data) {
  if (!io) return;
  io.to(`role:${role}`).emit(event, data);
}

/** Emits an event globally to all connected clients. */
export function emitGlobal(event, data) {
  if (!io) return;
  io.emit(event, data);
}
