import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemins des fichiers de log
const errorLogPath = path.join(__dirname, '../../logs/error.log');
const combinedLogPath = path.join(__dirname, '../../logs/combined.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
    ),
  transports: [
    new winston.transports.File({ filename: errorLogPath, level: 'error' }),
    new winston.transports.File({ filename: combinedLogPath })
  ]
});

// TODO : peut-être laisser ca pour grafana... ?
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  }));
}

export default logger;
