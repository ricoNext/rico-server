import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { BusinessException } from "../exceptions/business.exception";

export type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
  path?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = "INTERNAL_ERROR";
    let message = "Internal server error";
    let details: string | undefined;

    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ErrorResponse["error"];
      errorCode = exceptionResponse.code;
      message = exceptionResponse.message;
      details = exceptionResponse.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as ErrorResponse["error"];
        errorCode = responseObj.code || `HTTP_${status}`;
        message = responseObj.message || exception.message;
        details = responseObj.details;
      } else {
        message = exception.message;
        errorCode = `HTTP_${status}`;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = "UNKNOWN_ERROR";
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
