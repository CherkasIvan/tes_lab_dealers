import * as winston from 'winston';
import { format } from 'winston';

interface ServiceLogFieldsOptions {
    serviceName: string;
}

export function addServiceLogFieldsFormatter(options: ServiceLogFieldsOptions): winston.Logform.Format {
    return format((info) => {
        return {
            ...info,
            service: options.serviceName,
        };
    })();
}
