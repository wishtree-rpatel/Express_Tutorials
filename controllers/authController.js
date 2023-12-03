const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const fsPromises = require("fs").promises;
const path = require("path")

const userDB = {
    users: require("../models/users.json"),
    setUsers: function (data) {
      this.users = data;
    },
  };
  
const handlelogin = async (req, res) => {
    console.log("Inside handlelogin")
    const {user,pwd} = req.body;
    console.log("User",user)
    if(!user || !pwd){
        return res.status(401).json({message:"Username or password is missing"})
    }
    try {
        const foundUser = userDB.users.find(person => person.userName === user)
        if(!foundUser){
            return res.status(401).json({message:"Invalid Username or Password"})
        }
        console.log("FoundUser",foundUser)
        const match = await bcrypt.compare(pwd,foundUser.pwd)
        if(match){
            //Token creation
            const accessToken = jwt.sign(
                {"userName":foundUser.userName},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:"60s"}
            )
            const refreshToken = jwt.sign(
                {"userName":foundUser.userName},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:"1d"}
            );
            //saving refresh token in database(JSON File)
            const otherUsers = userDB.users.filter(person => person.userName !== foundUser.userName)
            const currentUser ={...foundUser,"refreshToken":refreshToken}
            userDB.setUsers([...otherUsers,currentUser])
            await fsPromises.writeFile(path.join(__dirname,"..","models","users.json"),JSON.stringify(userDB.users)); 

            res.cookie('jwt',refreshToken,{httpOnly:true,maxAge:1000*60*60*24}) 
            return res.status(200).json({message:"Logged in success",accessToken})
        }
        else return res.status(401).json({message:"Invalid Username or Password"})
    
    } catch (error) {
        return res.status(501).json({message:"Error",error:error.message})
    }
   
}

module.exports = {handlelogin}

