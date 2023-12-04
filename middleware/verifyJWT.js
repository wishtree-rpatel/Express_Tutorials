const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("headers", req.headers);
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) return res.status(401).json({ message: "Un-authorised" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.userInfo.userName;
    req.roles = decoded.userInfo.roles;
    next();
  });
};

module.exports = verifyToken;
