const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    unique: [true, "should be unique"],
    required: [true, "Provide a first Name"],
  },
  // lastName: String,
  mobile: {
    type: String,
    unique: [true, "Mobile No already Exists"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already Exists"],
    validate: [validator.isEmail, "Provide a valid mail"],
  },
  password: {
    type: String,
    select: false,
  },
});

adminSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    console.log("bcrypt error", error);
  }
  next();
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
