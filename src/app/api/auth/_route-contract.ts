/**
 * Transport contract shared by the future auth route handlers.
 * This file intentionally contains no database or UI implementation.
 */
export interface AuthRouteError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export interface AuthRouteResponse<T> {
  data: T | null;
  error: AuthRouteError | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupRequest {
  email: string;
  password: string;
  displayName: string;
  handle: string;
}
