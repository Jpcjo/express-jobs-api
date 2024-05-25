const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      //ObjectId: MongoDB automatically generates an _id of type ObjectId for each document if not provided.
      type: mongoose.Types.ObjectId,
      // VERY IMPORTANT!!! we are tieing our Job model to the User model.
      //Every time we create a job, we will assign it the one of the users.
      //An ObjectId is a special type used by MongoDB for unique identifiers.
      //By setting the type to ObjectId, you are indicating that this field
      //will reference another document's _id field, which is an ObjectId
      //in MongoDB.
      //type: mongoose.Types.ObjectId: Specifies that the field stores an ObjectId, which is used for referencing another document.
      ref: "User",
      //Establishes a reference to the User model, enabling population of the user data in queries.
      required: [true, "Please provide user"],
    },
    //This setup creates a relational link between the Job and User models,
    //allowing you to maintain and query relationships between different collections in your MongoDB database.
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
