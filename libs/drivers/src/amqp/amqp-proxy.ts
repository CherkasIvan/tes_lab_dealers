import { AmqpConnection, MessageHandlerOptions, RequestOptions, RpcResponse, SubscribeResponse } from '@golevelup/nestjs-rabbitmq';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { AmqpBaseMessage } from '@mobility/amqp-contracts';
import * as amqplib from 'amqplib';
import { AmqpProxyOptionsInterface } from './amqp-proxy-options.interface';
import { InternalLogger, runPromise, setRequestId } from '@app/common';
import { Injectable } from '@nestjs/common';

/**
 * Прокси для amqp
 */
@Injectable()
export class AmqpProxy extends AmqpConnection {
    constructor(private readonly proxyConfig: AmqpProxyOptionsInterface) {
        super(proxyConfig);
        this.internalLogger.log('AmqpProxy initialized');
    }

    private readonly internalLogger = new InternalLogger(AmqpConnection.name);

    /**
     * Создание подписчика
     * @param handler
     * @param msgOptions
     */
    createSubscriber<T>(
        handler: (msg: T | undefined, rawMessage?: amqplib.ConsumeMessage) => Promise<SubscribeResponse>,
        msgOptions: MessageHandlerOptions,
    ): Promise<void> {
        const proxyHandler: typeof handler = (msg, rawMessage) => {
            return runPromise(() => {
                const message = msg as unknown as AmqpBaseMessage<unknown>;
                if (message && message.requestId) {
                    setRequestId(message.requestId);
                } else {
                    setRequestId(randomStringGenerator());
                }

                const { exchange, routingKey } = msgOptions;
                this.logMessage(exchange as string, routingKey as string, message, 'message', true);
                return handler(msg, rawMessage);
            });
        };
        return super.createSubscriber(proxyHandler, msgOptions);
    }

    /**
     * Создание RPC
     * @param handler
     * @param rpcOptions
     */
    createRpc<T, U>(
        handler: (msg: T | undefined, rawMessage?: amqplib.ConsumeMessage) => Promise<RpcResponse<U>>,
        rpcOptions: MessageHandlerOptions,
    ): Promise<void> {
        const proxyRPCHandler = (msg: T | undefined, rawMessage?: amqplib.ConsumeMessage) => {
            return runPromise(async (): Promise<RpcResponse<U>> => {
                const message = msg as unknown as AmqpBaseMessage<unknown>;
                if (message && message.requestId) {
                    setRequestId(message.requestId);
                } else {
                    setRequestId(randomStringGenerator());
                }

                const { exchange, routingKey } = rpcOptions;
                this.logMessage(exchange as string, routingKey as string, msg, 'request', true);
                // Для запросов логирование ведется в interceptor-e, потому что там можно логировать, в какую очередь ответили
                // Если писать лог тут, то ответ будет в publish в очередь reply
                // const { exchange, routingKey } = rpcOptions;
                // this.logMessage(exchange as string, routingKey as string, message, 'request', true);
                const start = Date.now();
                const response = await handler(msg, rawMessage);
                const end = Date.now();
                this.logMessage(exchange as string, routingKey as string, response as object, 'response', false, end - start);
                return response;
            });
        };
        return super.createRpc(proxyRPCHandler, rpcOptions);
    }

    /**
     * Запрос
     * @param requestOptions
     */
    async request<T extends {}>(requestOptions: RequestOptions): Promise<T> {
        const { exchange, routingKey, payload } = requestOptions;
        this.logMessage(exchange, routingKey, payload, 'request', false);
        const startTime = Date.now();
        const response = await super.request<T>(requestOptions).catch((error) => {
            this.logError(error, exchange, routingKey, 'request');
            throw error;
        });
        const endTime = Date.now();
        this.logMessage(exchange, routingKey, response, 'response', true, endTime - startTime);
        return response;
    }

    /**
     * Публикация сообщения
     * @param exchange
     * @param routingKey
     * @param message
     * @param options
     */
    publish<T extends AmqpBaseMessage<never>>(
        exchange: string,
        routingKey: string,
        message: T,
        options?: amqplib.Options.Publish,
    ): Promise<void> {
        // в события не кидаем ответы на RPC
        if (!routingKey.match(/(reply)/) && !options?.replyTo) {
            this.logMessage(exchange, routingKey, message, 'message', false);
        }
        return super.publish(exchange, routingKey, message, options);
    }

    private logMessage<T = unknown>(
        exchange: string,
        routingKey: string,
        message: T,
        type: 'request' | 'response' | 'message',
        incoming: boolean,
        responseTime?: number,
    ) {
        if (!this.proxyConfig.enableLogs) {
            return;
        }

        const payload = (typeof message === 'object' && message !== null ? message : { message }) as object;

        if (type === 'request' || type === 'message') {
            const logMessage = `AMQP:${type}:${incoming ? 'incoming' : 'outgoing'}:${exchange}:${routingKey}`;
            this.internalLogger.log(logMessage);

            if (this.proxyConfig.logPayload) {
                this.internalLogger.debug({
                    message: logMessage,
                    internalPayload: payload,
                });
            }
            return;
        }

        const logMessage = `AMQP:${type}:${incoming ? 'incoming' : 'outgoing'}:${exchange}:${routingKey}:${responseTime}ms`;
        this.internalLogger.log(logMessage);

        if (this.proxyConfig.logPayload) {
            this.internalLogger.debug({
                message: logMessage,
                internalPayload: {
                    ...payload,
                    responseTime,
                },
            });
        }
    }

    private logError(error: Error, exchange: string, routingKey: string, type: 'request' | 'response' | 'message'): void {
        if (this.proxyConfig.enableLogs) {
            this.internalLogger.error(`AMQP:${type}:${exchange}:${routingKey}:${error.message}`, error.stack);
        }
    }
}
