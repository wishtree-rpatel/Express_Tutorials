const bcrypt = require("bcrypt");
const User = require("../models/Users")

const createNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: "Username or pwd is missing" });
  }
  //duplicate registration check
  // const duplicate = userDB.users.find((person) => person.userName === user);
  const duplicate = await User.findOne({userName:user})
  console.log("duplicate",duplicate)
  if (duplicate) {
    return res.status(400).json({ message: "Username is already in use" });
  }
  //creation of new user
  try {
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const result = await User.create({userName: user, pwd: hashedPassword})
    console.log("result",result)
    return res.status(201).json({ message: "New user created successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { createNewUser };
