export type UserRole = "passenger" | "driver" | "owner";

export interface User {
  name: string;
  phone: string;
  destination: string;
  createdAt: string;
  role?: UserRole;
}
