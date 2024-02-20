class AppError extends Error {
  constructor(message) {
    super(message);
  }
}

class PermissionDeniedError extends AppError {
  constructor() {
    super("Permission Denied.");
    this.name = "PermissionDeniedError";
    this.code = 401;
    this.symbol = "🚫";
  }
}

class InvalidUsageError extends AppError {
  constructor() {
    super("Invalid Usage.");
    this.name = "InvalidUsageError";
    this.code = 400;
    this.symbol = "❌";
  }
}

class IncompleteOperationError extends AppError {
  constructor() {
    super("Operation could not be completed successfully.");
    this.name = "IncompleteOperationError";
    this.code = 500;
    this.symbol = "⚠️";
  }
}

class TooManyRequestsError extends AppError {
  constructor() {
    super("Too many requests.");
    this.name = "TooManyRequestsError";
    this.code = 429;
    this.symbol = "🛑";
  }
}

module.exports = {
  PermissionDeniedError,
  InvalidUsageError,
  IncompleteOperationError,
  TooManyRequestsError,
  AppError,
};
