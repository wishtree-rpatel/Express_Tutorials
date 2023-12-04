const jwt = require("jsonwebtoken");
const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleRefreshToken = async (req, res) => {
  console.log("Inside handlelogin");
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Un-authorised" });
  }
  const refreshToken = cookies.jwt;
  try {
    const foundUser = userDB.users.find(
      (person) => person.refreshToken === refreshToken
    );
    if (!foundUser) {
      return res.status(401).json({ message: "Un-authorised" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.userName !== decoded.userName)
          return res.status(403).json({ message: "Forbidden" });
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            userInfo: {
              userName: foundUser.userName,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    return res.status(501).json({ message: "Error", error: error.message });
  }
};

module.exports = { handleRefreshToken };
