
const whiteList = ["https://google.com","http://127.0.0.1:3000","http://localhost:3000"]
const corsOptions = {
  origin: (origin,calllback)=>{
            if(whiteList.indexOf(origin) !== -1 || !origin){
              calllback(null,true)
            }
            else{
              calllback(new Error("Not allowed by cors"))
            }
  }
}

module.exports = corsOptions