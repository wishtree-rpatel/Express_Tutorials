const express = require("express")
const path = require("path");
const cors = require("cors")
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/usersRoutes")
const corsOptions = require("./config/corsOptions");

const app = express();

app.use(cors(corsOptions))

app.use(logger)

app.use(express.urlencoded({extended:false}))

app.use(express.json())

app.use(express.static(path.join(__dirname,"/public")))

// app.use("/",router)
app.use(userRoutes)
app.use("/auth",require("./routes/authRoutes"))

app.use(errorHandler)
app.listen(3000,() => console.log("Server is running at port 3000"))