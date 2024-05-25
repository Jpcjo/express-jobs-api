require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
// https://www.npmjs.com/package/express-rate-limit

// Swagger
// const swaggerUI = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");

const express = require("express");
const app = express();
const authenticateUser = require("./middleware/authentication");

//connectDB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
//The app.set('trust proxy', 1); configuration in an Express.js application is
//used to trust the first proxy in front of your application. This is particularly
//useful when your app is deployed behind a reverse proxy or load balancer (such as Nginx,
//HAProxy, or a cloud provider's load balancer).
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
); //Express Rate Limit is a middleware for Express.js applications that helps
//to limit repeated requests to public APIs and/or endpoints. It helps protect
//against brute-force attacks and reduces the load on the server by limiting
//the number of requests a client can make over a specified period of time.
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
// authenticate users first, then protect all job routes(create,delete,
// patch...etc) under authentication
// routes have to be before error messages

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3005;

const start = async () => {
  try {
    //connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
