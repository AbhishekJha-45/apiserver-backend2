const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).send({ message: "User Not Found" });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    delete existingUser.password;
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      maxAge: 3600000,
      signed: true,
    });
    res.redirect("/newblogpost");
  } catch (error) {
    res.status(500).send("Soemthing Went wrong: " + error.message);
  }
};

// Middleware to check for a valid JWT token
const authenticateToken = (req, res, next) => {
  const cookie = req.signedCookies.token;
  if (!cookie) {
    res.status(401);
    return res.redirect("/login"); // Unauthorized
  }

  try {
    jwt.verify(cookie, process.env.SECRET_KEY);
    next();
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
};
const logout = (req, res) => {
  res.clearCookie("token", { signed: true });
  return res.status(200).json({ message: "Logout successful!" });
};

module.exports = { signin, authenticateToken, logout };
