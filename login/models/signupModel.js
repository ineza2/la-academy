const mongoose = require("mongoose");
const Joi = require("joi");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, maxlength: 100, minlength: 3 },
  lastname: { type: String, required: true, maxlength: 100, minlength: 3 },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    minlength: 3,
  },
  birthDate: { type: Date },
  username: { type: String, required: true, unique: true },
  role: { type:String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
const validate = (user) => {
  const schema = Joi.object({
    firstname: Joi.string().max(100).min(3).required(),
    lastname: Joi.string().max(100).min(3).required(),
    email: Joi.string().max(100).min(3).required().email(),
    birthDate: Joi.date(),
    username: Joi.string().required(),
    password: Joi.required(),
    role: Joi.string().required()
  });
  return schema.validate(user);
};

module.exports = { User, validate };
