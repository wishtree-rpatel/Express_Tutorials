const User = require("../models/Users");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", { httoOnly: true, expiresIn: 1000 * 60 * 60 * 24 });
    return res.sendStatus(204);
  }
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log("result", result);

  res.clearCookie("jwt", { httoOnly: true, expiresIn: 1000 * 60 * 60 * 24 });
  res.status(200).json({ message: "logged out" });
};
module.exports = { handleLogout };
