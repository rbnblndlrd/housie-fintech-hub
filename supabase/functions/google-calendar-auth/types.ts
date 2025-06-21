
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface AuthState {
  user_id: string;
}

export interface AuthRequest {
  code?: string;
  action: string;
  user_id: string;
}
