import { StatusCodes } from "http-status-codes";

export class ApiError extends Error {
  public code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export const isApiError = (error: any): error is ApiError => {
  return (
    error.code &&
    typeof error.code === "number" &&
    error.code >= 400 &&
    error.code < 600 &&
    error.message &&
    typeof error.message === "string"
  );
};

export class BadRequestError extends ApiError {
  constructor() {
    super(StatusCodes.BAD_REQUEST, "bad request");
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, "token is expired or not login");
  }
}

export class NotFoundError extends ApiError {
  constructor(target: string) {
    super(StatusCodes.NOT_FOUND, `not found: ${target}`);
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor() {
    super(StatusCodes.METHOD_NOT_ALLOWED, "this method is not allowed");
  }
}

export class InternalServerError extends ApiError {
  constructor() {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Fatal error. Internal server error."
    );
  }
}
