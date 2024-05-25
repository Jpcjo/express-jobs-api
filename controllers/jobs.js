const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  // check middleware/authentication.js
  //The structure of req.user in an Express.js application typically comes from
  //middleware that handles authentication and attaches user information to the
  //req object. This middleware is usually custom-written or provided by authentication
  //libraries like Passport.js or JWT (JSON Web Token) libraries.
  console.log(req.user); //{ userId: '664c7990e19d00441a620ac3', name: 'Fay' }
  console.log(req.params); //{ id: '664daed6d04c90052e0e0523' }
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId, // need to check both ids, otherwise A user can just get B user's jobId and access the record
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  //add createdBy to req.body
  const job = await Job.create(req.body);
  // job= {
  //  "job": {
  //    "status": "pending",
  //    "_id": "664d97927af3de4eee3272fd",
  //    "company": "google",
  //    "position": "intern",
  //    "createdBy": "664c7990e19d00441a620ac3",
  //    "createdAt": "2024-05-22T06:58:26.926Z",
  //    "updatedAt": "2024-05-22T06:58:26.926Z",
  //    "__v": 0}}
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId }, //find that unique job
    req.body, //what we want to update
    { new: true, runValidators: true } // get back the newest version and run the validator
  );
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
};
