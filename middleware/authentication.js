const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  // check whether the authorization jwt exist. If not, invalid, if yes,
  // proceed to the following steps:
  // decode the JWT token (consists header, payload, signature)(payload has the real data)

  // Then construct req.user(didn't exist) by passing "id" and "name" for further usage.

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
    //{   userId: '664c7990e19d00441a620ac3',
    //    name: 'Fay',
    //    iat: 1716287889,
    //    exp: 1718879889 }
    // we have set up userId and name in jwt.sign() in models/User.js

    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    //req.user is NOT a built-in property of the req object in Express.js.

    //It is a custom property that you set up through middleware. Before you
    //set it, req.user does not exist.

    // from Models/User.js: UserSchema.methods.createJWT = function () {}

    // Result: {
    // "userId": "664c7990e19d00441a620ac3",
    // "name": "Fay" }

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
