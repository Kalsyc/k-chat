export interface LoginUserResponse {
  success: boolean;
  token: string;
  error: string;
}

export interface LogoutUserResponse {
  success: boolean;
  data: unknown;
}

export interface RegisterUserResponse {
  success: boolean;
  token: string;
  error: string;
}
