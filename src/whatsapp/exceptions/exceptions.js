class PermissionDeniedError extends Error {
  constructor() {
    super("Permission Denied.");
    this.name = "PermissionDeniedError";
    this.code = 401;
    this.symbol = '🚫';
  }
}

class InvalidUsageError extends Error {
  constructor() {
    super("Invalid Usage.");
    this.name = "InvalidUsageError";
    this.code = 400;
    this.symbol = '❌';
  }
}

class IncompleteOperationError extends Error {
  constructor() {
    super("Operation could not be completed successfully.");
    this.name = "IncompleteOperationError";
    this.code = 500;
    this.symbol = '⚠️';
  }
}

export default {
  PermissionDeniedError,
  InvalidUsageError,
  IncompleteOperationError
}