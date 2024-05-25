const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
// hash password. meaning encrypt password so when saving in database,
// if it's broken in, no one can steal it. This ensures that even if the database is compromised, the actual passwords are not exposed.

const register = async (req, res) => {
  // We don't use these codes below is because we can achieve the same result
  // by setting up schema middleware in models/User.js. It's cleaner the code.

  //   const { name, email, password } = req.body;

  //   //The lines of code involving bcrypt are used to securely hash a user's password
  //   //before storing it in the database.
  //   const salt = await bcrypt.genSalt(10);
  //   //The genSalt function generates a salt, which is a random string used in
  //   //the hashing process to ensure that even identical passwords result in different hashes.
  //   // 10 = 10 random bytes. It is good for both complexity and performances
  //   const hashPassword = await bcrypt.hash(password, salt);
  //   //bcrypt.hash(password, salt): The hash function takes the plain text password
  //   //and the salt generated in the previous step to produce a hashed password.

  //   // result of hashPassword: $2a$10$HkDT7HzF.xkx4ZUBRW2.S.gFkkNK9V5UOhmb8OA856xZO8v/xBK4.
  //   const tempUser = { name, email, password: hashPassword };
  //   //Hashed Password: The result (hashPassword) is the encrypted version of
  //   //the plain text password, which can then be safely stored in the database.

  //   const user = await User.create({ ...tempUser });
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};
// console.log(StatusCodes.CREATED); // 201

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
