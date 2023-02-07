import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MainExceptionFilter } from './exception.filter';

@Module({
    providers: [{ provide: APP_FILTER, useClass: MainExceptionFilter }],
})
export class ErrorHandlerModule {}
