const { createLogger, format, transports, addColors } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { combine, timestamp, printf, colorize } = format;

const ENV = process.env.NODE_ENV || "dev";

const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    audit: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    critical: "red bold",
    error: "red",
    warn: "yellow",
    audit: "magenta",
    info: "green",
    debug: "blue",
  },
};

addColors(customLevels.colors);

const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  levels: customLevels.levels,
  format: combine(timestamp(), logFormat),
  transports: [
    new DailyRotateFile({
      filename: `logs/${ENV}-app-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "info",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      filename: `logs/${ENV}-error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    }),
  ],
});

if (ENV !== "production") {
  logger.add(
    new transports.Console({
      level: "info",
      format: combine(colorize(), timestamp(), logFormat),
    }),
  );
}

module.exports = logger;
