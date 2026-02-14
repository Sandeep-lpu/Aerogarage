import User from "../../../shared/models/user.model.js";
import RefreshToken from "../../../shared/models/refreshToken.model.js";

export function findUserByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase().trim() });
}

export function findUserById(id) {
  return User.findById(id);
}

export function createUser(payload) {
  return User.create(payload);
}

export function createRefreshToken(payload) {
  return RefreshToken.create(payload);
}

export function findRefreshTokenByHash(tokenHash) {
  return RefreshToken.findOne({ tokenHash });
}

export function revokeRefreshTokenByHash(tokenHash) {
  return RefreshToken.updateOne({ tokenHash }, { $set: { revokedAt: new Date() } });
}

export function revokeAllRefreshTokensForUser(userId) {
  return RefreshToken.updateMany(
    { userId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}
