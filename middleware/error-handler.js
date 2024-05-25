const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  // err usually returns back a giant object.
  // therefore the codes below deconstruct the object, extract the essentials and return a more user friendly msgs.
  let customError = {
    // set default:
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === "ValidationError") {
    // console.log(err) to know the structures
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.values(
      // err.keyValue is an Object:{"email":"fwudesign@gmail.com"}
      // to extract keys(email) or values(fwudesign@gmail.com), need to use Object.keys or Object.values method
      err.keyValue
    )} field, please choose another email.`;
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    //If you try to find a job by an invalid _id, Mongoose will throw a CastError:

    //The CastError is a specific type of error in Mongoose that occurs
    //when the application attempts to cast a value to a type that Mongoose
    //cannot cast it to. This is common with ObjectId values used in MongoDB,
    //where Mongoose expects a specific format for the IDs.
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  //console.log({err})
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
