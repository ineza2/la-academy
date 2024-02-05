const mongoose = require("mongoose");

const courseModel = new mongoose.Schema({
  name: String,
  instructor: String,
  credits: Number,
});
const Course = mongoose.model("Course", courseModel);

module.exports = Course;