require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("---Connected to Database---"));

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: true,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// set temlate engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/routes"));

// setting static path for css anf js fiels
const staticpath = path.join(__dirname, "../public");
app.use(express.static(staticpath));

// setting static images path
const staticImagePath = path.join(__dirname, "uploads");
app.use("/images", express.static(staticImagePath));
// getting requests from the clients
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
