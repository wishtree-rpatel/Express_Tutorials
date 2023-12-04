const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const createNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ message: "Username or pwd is missing" });
  }
  //duplicate registration check
  const duplicate = userDB.users.find((person) => person.userName === user);
  if (duplicate) {
    return res.status(400).json({ message: "Username is already in use" });
  }
  //creation of new user
  try {
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = { userName: user, pwd: hashedPassword,roles:{User:2001}  };
    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDB.users)
    );
    console.log("User created successfully!");
    return res.status(201).json({ message: "New user created successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { createNewUser };
