export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: "new" | "contacted" | "qualified" | "lost";
  aiMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
