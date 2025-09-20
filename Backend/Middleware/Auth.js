// ✅ authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../Model/UserModel");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.User = user;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Export the function directly
module.exports = authMiddleware;
