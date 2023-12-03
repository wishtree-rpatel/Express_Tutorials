const errorHandler = (err,req,res,next)=>{
    console.log("error",err.stack)
    res.status(500).send(err.message);
    next()
  }

module.exports = errorHandler;