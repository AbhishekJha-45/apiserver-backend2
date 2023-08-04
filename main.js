require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize"); // For sanitizing MongoDB queries
const helmet = require("helmet"); // Adds security-related HTTP headers
const xss = require("xss-clean"); // Prevents cross-site scripting attacks
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Set up middleware for enhanced security
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("---Connected to Database---"));

// Securely store session secret
if (!process.env.SECRET_KEY) {
  console.error("No session secret found in environment.");
  process.exit(1);
}

app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false, // Only create session for users with data
    resave: false, // Do not save session if unmodified
    cookie: {
      secure: true, // Use only over HTTPS
      httpOnly: true, // Prevents JavaScript access to cookies
      sameSite: "strict", // Mitigates cross-site request forgery (CSRF) attacks
    },
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Set template engine
app.set("view engine", "ejs");

// Route prefix
app.use("/", require("./routes/routes"));

// Setting static paths
const staticpath = path.join(__dirname, "../public");
app.use(express.static(staticpath));

const staticImagePath = path.join(__dirname, "uploads");
app.use("/images", express.static(staticImagePath));

// Implement authentication and authorization for routes as needed

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
