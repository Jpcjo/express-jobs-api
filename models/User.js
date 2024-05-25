const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true, // It creates an unique index. It's not a validator
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

// to encode user password
UserSchema.pre("save", async function (next) {
  // do stuff
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // this refers to the document(UserSchema)
  next();
});
// https://mongoosejs.com/docs/middleware.html#pre
//The UserSchema.pre("save", async function () { ... }) method in Mongoose is a
// middleware function that is executed before a document is saved to the database.
// This specific middleware function is used to hash a user's password before saving it, ensuring that the password stored in the database is not in plain text.

// create JWT token
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    //jwt.sign(payload, secretOrPrivateKey, [options]):
    //This function is used to create a new JWT.
    { userId: this._id, name: this.name },
    //  // this refers to the document(UserSchema)
    // The payload is an object containing the data you want to include in the
    //token. In this case, it includes the id and username of the user.
    //This data will be encoded in the token and can be decoded and verified by
    //any recipient who has the secret key.
    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
