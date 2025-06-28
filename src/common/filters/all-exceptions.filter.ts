import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message || exception.message
          : (exceptionResponse as string);
      code = exception.name;
    } else if (exception instanceof MongoError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handleMongoError(exception);
      code = 'MONGO_ERROR';
    } else if (exception instanceof Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values(exception.errors)
        .map((err) => err.message)
        .join(', ');
      code = 'VALIDATION_ERROR';
    } else if (exception instanceof Error.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ${exception.kind}: ${exception.value}`;
      code = 'CAST_ERROR';
    } else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message || 'Unauthorized';
      code = 'AUTH_ERROR';
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      status: 'fail',
      data: message,
      code,
    });
  }

  private handleMongoError(error: MongoError): string {
    switch (error.code) {
      case 11000:
        return 'Duplicate key error';
      default:
        return 'Database error';
    }
  }
}
