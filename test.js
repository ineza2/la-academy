const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/coursesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a user schema
const userSchema = new mongoose.Schema({
  username: String,
  role: String,
});

// Create a user model
const User = mongoose.model("User", userSchema);

// Define a course schema
const courseSchema = new mongoose.Schema({
  name: String,
  instructor: String,
  credits: Number,
});

// Create a course model
const Course = mongoose.model("Course", courseSchema);

app.use(express.json());

// Middleware to check user role
const checkUserRole = async (req, res, next) => {
  try {
    const { username } = req.headers;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to check user role" });
  }
};

// Define routes
app.get("/courses", checkUserRole, async (req, res) => {
  try {
    const { user } = req;
    if (user.role === "student") {
      const courses = await Course.find(
        {},
        { name: 1, instructor: 1, credits: 1 }
      );
      res.json(courses);
    } else if (user.role === "teacher") {
      const courses = await Course.find();
      res.json(courses);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.post("/courses", checkUserRole, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "teacher") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { name, instructor, credits } = req.body;
    const newCourse = new Course({ name, instructor, credits });
    await newCourse.save();
    res.json(newCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to create a course" });
  }
});

app.put("/courses/:id", checkUserRole, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "teacher") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { id } = req.params;
    const { name, instructor, credits } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, instructor, credits },
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the course" });
  }
});

app.delete("/courses/:id", checkUserRole, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "teacher") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { id } = req.params;
    await Course.findByIdAndRemove(id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the course" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
