require("dotenv").config();
const jwt = require("jsonwebtoken");
const userDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path")

const handleLogout =async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;

  const foundUser = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httoOnly: true, expiresIn: 1000 * 60 * 60 * 24 });
    return res.sendStatus(204);
  }
  
  const otherUsers = userDB.users.filter(person => person.refreshToken !== refreshToken)
  userDB.setUsers([otherUsers,{userName:foundUser.userName,pwd:foundUser.pwd}])
  await fsPromises.writeFile(path.join(__dirname,"..","models","users.json"),JSON.stringify(userDB.users))
  res.clearCookie('jwt',{httoOnly:true,expiresIn:1000 * 60 * 60 * 24})
  res.status(200).json({message:"logged out"})
};
module.exports ={ handleLogout};
