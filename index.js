require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/usersRoutes");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbConnect = require("./config/dbConn");

const app = express();

dbConnect();
app.use(cors(corsOptions));

app.use(logger);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

//auth routes
app.use("/auth", require("./routes/authRoutes"));

//verifies the JWT
app.use(require("./middleware/verifyJWT"));


app.use("/refresh", require("./routes/refreshTokenRoutes"));

//middleware to verify JWT, used here as we don't want to verify JWT for login and registration routes
app.use(userRoutes);

app.use(errorHandler);
mongoose.connection.once("open", () => {
    console.log("DB connected")
  app.listen(3000, () => console.log("Server is running at port 3000"));
});
