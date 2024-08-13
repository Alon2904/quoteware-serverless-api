import { HTTP_STATUS_CODES } from "./httpStatusCodes";

export class QuoteNotFoundError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = "QuoteNotFoundError";
      this.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
    }
  }

  export class MissingArgumentError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = "MissingArgumentError";
      this.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
    }
  }
  
  export class DynamoDBError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = "DynamoDBError";
    this.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
  }

  export class ValidationError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = "ValidationError";
      this.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
    }
  }

  export class ProjectNotFoundError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = "ProjectNotFoundError";
      this.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
    }
  }

  export class ProjectAlreadyExistsError extends Error {
    statusCode: number;
    constructor(message: string) {
      super(message);
      this.name = "ProjectAlreadyExistsError";
      this.statusCode = HTTP_STATUS_CODES.CONFLICT;
    }
  }
  