import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    const token = req.header("admin-auth");

    if (!token) {
      return res.status(401).json({ error: " Admin access denied" });
    }

    const payload = jwt.verify(token, "sherlock"); // throw error for invalid token
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({message: "Admin access denied"});
  }
};

export default authenticateToken;
