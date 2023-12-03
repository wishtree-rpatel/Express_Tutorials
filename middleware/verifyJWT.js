const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  console.log("headers", req.headers);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Un-authorised" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.userName;
    next();
  });
};

module.exports = verifyToken;
