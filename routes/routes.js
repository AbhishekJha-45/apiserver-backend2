const express = require("express");
const router = express.Router();
const path = require("path");
const mime = require("mime");
const multer = require("multer");
const NewBlogPost = require("../models/newblogpost");
const Users = require("../models/users");
const NewCaseStudy = require("../models/newcasestudy");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const {
  signin,
  authenticateToken,
  logout,
} = require("../middlewares/authentication");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser(process.env.SECRET_KEY));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
var upload = multer({
  storage: storage,
}).single("image");

//login authentication
router.post("/authenticate", signin);
//rendering login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});
router.get("/logout", (req, res, next) => {
  res.clearCookie("token");
  next();
  res.redirect("/login");
});

// creating new posts

router.post("/newblogpost", authenticateToken, upload, (req, res) => {
  const newblogPost = new NewBlogPost({
    title: req.body.title,
    description: req.body.description,
    image: "http:localhost:5000/images/" + req.file.filename,
    post_url: req.body.post_url,
    redirect_url: req.body.redirect_url,
    author_name: req.body.author_name,
    cannonical_tag: req.body.cannonical_tag,
    category: req.body.category,
    robots: req.body.robots,
    heading: req.body.heading,
    rating: 0,
    totalRatings: 0,
    table_of_contents: req.body.tableofcontents,
    content: req.body.content,
    totalRatings: req.body.rating,
  });

  newblogPost
    .save()
    .then(() => {
      res.send("Blog post saved successfully");
    })
    .catch((error) => {
      res.status(500).send("Error saving blog post: " + error);
    });
});

//create new case study
router.post("/newcasestudy", upload, (req, res) => {
  const newcaseStudy = new newcasestudy({
    title: req.body.title,
    description: req.body.description,
    // image: req.file.filename,
    image: "http:localhost:5000/images/" + req.file.filename,
    post_url: req.body.post_url,
    redirect_url: req.body.redirect_url,
    author_name: req.body.author_name,
    cannonical_tag: req.body.cannonical_tag,
    robots: req.body.robots,
    heading: req.body.heading,
    top: { para: req.body.para1, para2: req.body.para2, para3: req.body.para3 },
    top2: {
      para: req.body.para4,
      para2: req.body.para5,
      para3: req.body.para6,
    },
    top3: {
      para: req.body.para7,
      para2: req.body.para8,
      para3: req.body.para9,
    },
    top4: {
      para: req.body.para10,
      para2: req.body.para11,
      para3: req.body.para12,
    },
    bottom: {
      para: req.body.para13,
      para2: req.body.para14,
      para3: req.body.para15,
    },
  });

  newcaseStudy
    .save()
    .then(() => {
      res.send("Blog post saved successfully");
    })
    .catch((error) => {
      res.status(500).send("Error saving blog post: " + error);
    });
});

// creating new users
router.post("/signup", authenticateToken, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Both email and password are required." });
  }
  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new Users({
      email: email,
      password: hashedPassword,
      updated_at: Date.now(),
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Create a JWT token for the user
    const token = jwt.sign(
      { email: savedUser.email, id: savedUser._id },
      process.env.SECRET_KEY
    );

    // Respond with the new user and the token
    res.redirect("/");
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).send("Error creating new user: " + error.message);
  }
});

//rerndering signup page
router.get("/signup", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/users.html"));
});

// retriving individual blog posts
router.get("/", async (req, res) => {
  try {
    let query = {};

    // Check if the name query parameter is provided
    if (req.query.post_url) {
      query.post_url = req.query.post_url;
    }

    const newblogPost = await NewBlogPost.find(query).exec();
    res.send(newblogPost);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// retriving image
// router.get("/", async (req, res) => {});

const staticPath = path.join(__dirname, "../public");
router.use(express.static(staticPath));

router.get("/newblogpost", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/forms.html"));
});
// render new case study page
router.get("/newcasestudy", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/new_case_study.html"));
});
router.get("/blog/rating", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/rating.html"));
});
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});
// update rating here
router.put("/rating/:post_url", async (req, res) => {
  try {
    const post_url = req.params.post_url;
    const { rating } = req.query; // Get the rating from the query parameters
    // const { totalRatings } = req.query;
    // Update the document by post_url and the specified rating
    const updatedPost = await NewBlogPost.findOneAndUpdate(
      { post_url },
      { $set: { rating }, $inc: { totalRatings: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      // If the document is not found
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.sendStatus(204); // Send a 204 No Content status code to indicate success without a response body
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// get latest posts based on category as query
router.get("/blog/latestposts/", async (req, res) => {
  try {
    let query = {};

    // Check if the category query parameter is provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    let limit = 5;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const latestPosts = await NewBlogPost.find(query)
      .sort({ created_at: -1 })
      .limit(limit); // Retrieve the latest 5 posts

    res.send(latestPosts);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// get latest blog posts based on created_at
router.get("/latestposts/", async (req, res) => {
  try {
    const latestPosts = await NewBlogPost.find({})
      .sort({ created_at: -1 })
      .limit(5); // Retrieve the latest 10 posts

    res.send(latestPosts);
  } catch (error) {
    res.json({ message: error.message });
  }
});

//get latest case study if limit is given or all post by default
router.get("/casestudy/latestposts/", async (req, res) => {
  try {
    let query = {};

    // Check if the category query parameter is provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    let limit = parseInt(req.query.limit); // If limit is provided, it will be a number. Otherwise, it will be NaN.

    // If limit is not provided or is NaN, set it to null to retrieve all posts
    if (!limit || isNaN(limit)) {
      limit = null;
    }

    let latestPosts;

    if (limit) {
      // If limit is provided, retrieve the latest posts with the specified limit
      latestPosts = await NewCaseStudy.find(query)
        .sort({ created_at: -1 })
        .limit(limit);
    } else {
      // If limit is not provided or is NaN, retrieve all posts
      latestPosts = await NewCaseStudy.find(query).sort({ created_at: -1 });
    }

    res.send(latestPosts);
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.get("/public/css/main.css", (req, res, next) => {
  res.setHeader("Content-Type", mime.getType("text/css"));
  next();
});
router.get("/casestudy/:post_url", async (req, res) => {
  try {
    const post_url = req.params.post_url;

    const casestudy = await newcasestudy.findOne({ post_url });

    if (!casestudy) {
      // If the document is not found
      return res.status(404).json({ message: "Case study not found" }); // Changed the message to be more accurate
    }

    res.json(casestudy); // Send the case study details as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
