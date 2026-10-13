import jwt from 'jsonwebtoken';

/** Sign a JWT for a given user id + role. */
export function signToken(userId, role) {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/** Verify a JWT and return its payload, or throw. */
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
