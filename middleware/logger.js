const logger = (req,res,next)=>{
    console.log(`${req.method} ${req.origin} ${req.path}`)
    next()
  }
module.exports = logger