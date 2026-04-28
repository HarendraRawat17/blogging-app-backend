import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// custom log format for console
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${ timestamp } [${level}] : ${stack || message }`;
});


export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    errors({ stack: true }), // log stack trace
    json(),
  ),

  transports: [
    // console logs (dev friendly)
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // File logs (production)

    // new winston.transports.File({
    //   filename: "logs/error.log",
    //   level: "error"
    // }),

    // new winston.transports.File({
    //   filename: "logs/combined.log",
    // }),
  ],
});