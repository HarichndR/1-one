const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = '7d';

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = JWT.sign(payload, secret, { expiresIn: ACCESS_TOKEN_EXPIRY });
  return token;
}

function validateToken(token) {
  if (!token) return { error: "Token is not provided" };

  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = {
  createTokenForUser,
  validateToken,
};
