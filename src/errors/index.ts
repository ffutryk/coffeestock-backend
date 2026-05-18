import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  readonly statusCode = 404;
}

export class BadRequestError extends AppError {
  readonly statusCode = 400;
}

export class ConflictError extends AppError {
  readonly statusCode = 409;
}

export class InvalidCredentialsError extends AppError {
  readonly statusCode = 401;
}
