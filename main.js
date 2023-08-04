require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const routes = require("./routes/routes");

const PORT = process.env.PORT || 4000;

<<<<<<< HEAD
app.use(cors());
=======
const app = express();

// Enable CORS with specific whitelist domains
const allowedOrigins = ["http://example.com", "http://localhost:3000"]; // Add your allowed domains here
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(helmet()); // Enable various security headers

// Implement rate limiting to prevent abuse or DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

>>>>>>> e7eaa655aa52944f48a0d0c1dda29d0e8a410b2c
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("---Connected to Database---"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
<<<<<<< HEAD
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: true,
=======
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
>>>>>>> e7eaa655aa52944f48a0d0c1dda29d0e8a410b2c
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Set template engine
app.set("view engine", "ejs");

// Using the router from routes.js
app.use("/", routes);

// Setting static path for css and js files
const staticpath = path.join(__dirname, "../public");
app.use(express.static(staticpath));

// Setting static images path
const staticImagePath = path.join(__dirname, "uploads");
app.use("/images", express.static(staticImagePath));


// getting requests from the clients
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
