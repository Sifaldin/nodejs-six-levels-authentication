require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
  res.render("home");
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (e, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash
    })
    newUser.save((e) => {
      if (!e) { res.render("secrets"); }
      else { console.log(e) }
    })
  })
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (e, foundUser) => {
    if (e) { console.log(e) }
    else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (e, result) => {
          if (result) { res.render("secrets") }
        });
      }
    }
  })
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});