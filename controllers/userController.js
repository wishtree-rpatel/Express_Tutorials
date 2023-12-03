const defaultCall = (req, res) => {
    res.send({ success: true, data: "Home page" });
  }

const userRoute = (req,res) => {
    res.send({success:true, data: "user data"})
}

const backout = (req,res)=>{
    res.status(404).json({"data":"Page not found"})
  }
module.exports = {defaultCall,userRoute,backout}