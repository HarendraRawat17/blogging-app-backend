import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import { dbConnect } from "./Database/dbconnect.js";
import { userRoute } from "./Routes/user.route.js";
import { customError } from "./Utils/errorClass.js";
import cookieParser from "cookie-parser"
import { limiter } from "./Services/ratelimiter.js";

import morgan from "morgan";
import { Logger } from "winston";
import { logger } from "./Utils/logger.js";




// process environment config

dotenv.config();



const server = express();


// middlewares
server.use(express.json());
server.use (
  cors({
    origin: ["https://the-unfolding.netlify.app/", "http://localhost:5173/" ],
    credentials : true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"]
  }
  )
);
// server.use(express.urlencoded({extended: true, limit: "16kb"}));
server.use(cookieParser());






// database connection

// port info
const PORT = parseInt(process.env.PORT) || 3002;

console.log('Connecting to DB...');

//db connect with port



(async () => {
  try {
    await dbConnect();
    server.listen(PORT, () => {
      console.log(`server has started on port ${PORT}`);
      logger.info(`server has started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
    logger.info(error.message);
  }
})();


// rate limiter
server.use(limiter);


server.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

server.get("/", (req, res) => {
  logger.info("server running...!!")
  console.log("server running")
  res.send("server running")
});

// server.post('/upload', upload.single('profile'), (req, res) => {
//   res.json({ message: 'Success', imageUrl: '...' });
// });



server.use("/api/user", userRoute)


// Global error Handler Middleware
server.use((err, req, res, next) => {
  console.log(err.message)

  // Set the response status code
  const statusCode = err.statusCode || 500;
  res.status(statusCode);

  // SEND a json response to the client
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
})



// server.listen(PORT, () => {
//   console.log("server is running on port", PORT)
// })



// mkdir - for folder formation in Terminal
