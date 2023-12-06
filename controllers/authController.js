const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const handlelogin = async (req, res) => {
  console.log("Inside handlelogin");
  const { user, pwd } = req.body;
  console.log("User", user);
  if (!user || !pwd) {
    return res.status(401).json({ message: "Username or password is missing" });
  }
  try {
    const foundUser = await User.findOne({ userName: user });
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }
    console.log("FoundUser", foundUser);

    const match = await bcrypt.compare(pwd, foundUser.pwd);
    if (match) {
      //Token creation
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          userInfo: {
            userName: foundUser.userName,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "600s" }
      );
      const refreshToken = jwt.sign(
        { userName: foundUser.userName },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      //add refresh token in database
      foundUser.refreshToken = refreshToken;
      await foundUser.save()
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      return res
        .status(200)
        .json({ message: "Logged in success", accessToken });
    } else
      return res.status(401).json({ message: "Invalid Username or Password" });
  } catch (error) {
    return res.status(501).json({ message: "Error", error: error.message });
  }
};

module.exports = { handlelogin };
