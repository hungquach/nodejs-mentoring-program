import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, colorize } = format;

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        colorize(),
        label({ label: 'App' }),
        timestamp(),
        printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`)
    ),
    defaultMeta: {},
    transports: [
        new winston.transports.Console()
    ],
});

export default logger;