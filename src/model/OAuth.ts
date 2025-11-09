export interface OAuth {
  id: number;
  user_id: number;
  provider: string;
  encrypted_client_id: string;
  encrypted_client_secret: string;
  encrypted_refresh_token: string;
  salt: string;
  created_at: string;
}

export interface OAuthRequest {
  provider: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
}
