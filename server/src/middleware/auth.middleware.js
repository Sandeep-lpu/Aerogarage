// ── Authentication Middleware ──────────────────────────────────────────────
// Provides two Express middleware functions for route protection:
//   - requireAuth:  verifies the JWT access token from the Authorization header
//   - requireRoles: checks that the authenticated user has one of the allowed roles
import { verifyAccessToken } from "../modules/auth/services/auth.service.js";

// requireAuth — validates the Bearer JWT and attaches decoded user info to req.user.
// Must be applied before any middleware that reads req.user.
export function requireAuth(req, res, next) {
  try {
    // Extract token from "Authorization: Bearer <token>" header
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.fail("Authentication required", 401);
    }

    const decoded = verifyAccessToken(token, req.app.locals.env);
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    };

    return next();
  } catch {
    return res.fail("Invalid or expired token", 401);
  }
}

// requireRoles — role-based access control guard (RBAC).
// Must be used AFTER requireAuth so that req.user is populated.
// @param {...string} roles - Allowed roles (e.g. 'admin', 'employee', 'client')
export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.fail("Authentication required", 401);
    }

    if (!roles.includes(req.user.role)) {
      return res.fail("Forbidden: insufficient permissions", 403);
    }

    return next();
  };
}
