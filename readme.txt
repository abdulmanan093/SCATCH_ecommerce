npm init -y
npm i express jsonwebtoken bcrypt cookie-parser
npm i ejs mongoose
npm i debug
npm i config
npm i dotenv
npm i express-session
npm i connect-flash
npm i multer




//////////Environment//////////////
setx DEBUG "development:*"
setx DEBUG ""

setx NODE_ENV "development:*"
setx NODE_ENV ""

////////////////////////////////






/////////// Default ///////////
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require(path);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000);