const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/configauth");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
