const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect("mongodb://127.0.0.1:27017/Lacademy", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("successfully connected to the database");
    })
    .catch((err) => console.log(err));
};

module.exports = connectToDB;
