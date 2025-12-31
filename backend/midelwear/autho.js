const { validateToken } = require("../seirvise/autho");

module.exports = async (req, res, next) => {
  console.log('mid called')
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await validateToken(token);
    req.user = payload; // attach user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
