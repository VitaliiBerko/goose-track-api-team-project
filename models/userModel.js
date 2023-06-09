const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwtToken = require("../helpers/jwtToken");

const userModel = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    telegram: {
      type: String,
      default: null,
    },
    birthday: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

/**
 * Auto password hashing and avatar generating
 */
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/**
 * Auto token generating for new user
 */
userModel.post("validate", function (_, next) {
  if (this.isNew) {
    this.token = jwtToken.jwtTokenSign(this._id);
  }

  next();
});

userModel.methods.comparePassword = (myPlaintextPassword, hash) =>
  bcrypt.compare(myPlaintextPassword, hash);

const User = model("user", userModel);

module.exports = { User };
