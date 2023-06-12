const routes= require("express").Router();
const { User, validate } = require("../models/signupModel");
const bcrypt=require("bcrypt");
routes.post('/create', async (req, res) => {
  try {
    const { error } = validate(req.body);
    console.log(error);
    if (error) {
      return res.send(error).status(400);
    }

    let newUser = await User.findOne({ email: req.body.email });
    if (newUser) {
      return res.send("user already registered").status(400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      birthDate: req.body.birthDate,
      username: req.body.username,
      password: hashPassword,
      role: req.body.role,
    });
    await newUser.save();
    res.send("Successfully created new user")
    // res.redirect("/api/account/signin");
  } catch (err) {
    console.log(err);
    res.send("error signing up, reload the page" + err).status(400);
  }
});

module.exports = routes;