import {
  loginUser,
  logoutUser,
  refreshAuthToken,
  registerUser,
  verifyAccessToken,
} from "../services/auth.service.js";

export async function registerController(req, res, next) {
  try {
    const user = await registerUser(req.body);
    return res.success({ user }, "User registered", 201);
  } catch (error) {
    return next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const auth = await loginUser(req.body, req.app.locals.env);
    return res.success(auth, "Login successful");
  } catch (error) {
    return next(error);
  }
}

export async function refreshController(req, res, next) {
  try {
    const auth = await refreshAuthToken(req.body.refreshToken, req.app.locals.env);
    return res.success(auth, "Token refreshed");
  } catch (error) {
    return next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    await logoutUser(req.body.refreshToken);
    return res.success(null, "Logged out");
  } catch (error) {
    return next(error);
  }
}

export async function meController(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.fail("Authorization token required", 401);
    }

    const decoded = verifyAccessToken(token, req.app.locals.env);
    return res.success(
      {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      },
      "Authenticated user",
    );
  } catch (error) {
    error.statusCode = 401;
    return next(error);
  }
}
