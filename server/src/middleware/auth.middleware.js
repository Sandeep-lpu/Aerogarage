import { verifyAccessToken } from "../modules/auth/services/auth.service.js";

export function requireAuth(req, res, next) {
  try {
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
