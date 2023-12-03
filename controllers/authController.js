const bcrypt = require("bcrypt")
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
           return res.status(200).json({message:"Logged in success"})
        }
        else return res.status(401).json({message:"Invalid Username or Password"})
    
    } catch (error) {
        return res.status(501).json({message:"Error",error:error.message})
    }
   
}

module.exports = {handlelogin}