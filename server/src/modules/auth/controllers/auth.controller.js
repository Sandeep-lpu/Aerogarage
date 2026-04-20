import {
  loginUser,
  logoutUser,
  refreshAuthToken,
  registerUser,
  verifyAccessToken,
  verifyEmailToken,
  resendVerificationEmail,
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

export async function meController(req, res) {
  // requireAuth middleware has already validated the token and populated req.user
  return res.success(
    { id: req.user.id, email: req.user.email, role: req.user.role },
    "Authenticated user",
  );
}

export async function verifyEmailController(req, res, next) {
  try {
    const result = await verifyEmailToken(req.query.token);
    return res.success(result, result.message);
  } catch (error) {
    return next(error);
  }
}

export async function resendVerificationController(req, res, next) {
  try {
    // requireAuth ensures req.user is set
    await resendVerificationEmail(req.user.id);
    return res.success(null, "Verification email resent");
  } catch (error) {
    return next(error);
  }
}
