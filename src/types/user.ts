export type UserRole = "user" | "host" | "admin";

export interface User {
  id: string;
  handle: string;
  displayName: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
