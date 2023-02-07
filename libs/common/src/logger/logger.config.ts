import * as winston from 'winston';
import { utilities } from 'nest-winston';
import { addRequestIdFormatter, addServiceLogFieldsFormatter, removeInternalPayloadStringFormatter } from './formatters';
import { checkEnvs } from '../utils';

export const LOGGER_CONFIG = (serviceName: string, dirEnv = 'LOG_DIR', debugEnv = 'APP_LOGGER_DEBUG') => {
    const logDirName = process.env[dirEnv];
    const appLoggerDebug = process.env[debugEnv];
    checkEnvs(logDirName, dirEnv);
    checkEnvs(appLoggerDebug, `${debugEnv}=on|off`);
    return {
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                    addRequestIdFormatter(),
                    removeInternalPayloadStringFormatter(),
                    winston.format.ms(),
                    utilities.format.nestLike(serviceName, {
                        prettyPrint: true,
                        colors: true,
                    }),
                ),
                level: appLoggerDebug === 'on' ? 'debug' : 'info',
            }),
            new winston.transports.File({
                dirname: logDirName,
                filename: serviceName + '.log',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    addServiceLogFieldsFormatter({ serviceName }),
                    addRequestIdFormatter(),
                    winston.format.logstash(),
                ),
                level: 'debug',
            }),
        ],
    };
};
