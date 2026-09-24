export type RepositoryErrorCode =
  | "CONFLICT"
  | "NOT_FOUND"
  | "INVALID_INPUT"
  | "UNAVAILABLE"
  | "UNKNOWN";

export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly code: RepositoryErrorCode,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "RepositoryError";
  }
}