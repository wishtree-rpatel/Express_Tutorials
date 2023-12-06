const jwt = require("jsonwebtoken");
const User = require("../models/Users")

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
 console.log("handle refresh")
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Un-authorised" });
  }
  const refreshToken = cookies.jwt;
  try {
    const foundUser = await User.findOne({refreshToken});
    console.log(foundUser)
    // const refreshToken = User.find(user => user.refreshToken)
    if (!foundUser) {
      return res.status(401).json({ message: "Un-authorised dddd" });
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
