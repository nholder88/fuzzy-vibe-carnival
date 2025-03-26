const winston = require('winston');
const path = require('path');

// Define console format
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
        return `${timestamp} ${level}: ${message}${metaString}`;
    })
);

// Define file format
const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        // Console transport with readable format
        new winston.transports.Console({
            format: consoleFormat
        }),
        // File transport for errors
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log'),
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

// Create a stream object for Morgan with console colors
const morganFormat = ':method :url :status :response-time ms - :res[content-length]';
const stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = { logger, stream }; 