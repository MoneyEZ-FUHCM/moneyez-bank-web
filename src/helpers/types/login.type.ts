import { BaseResponse } from "./common.type";

export interface LoginFormParams {
  email: string;
  password: string;
}

export interface ApiResponse {
  status: number;
  errorCode: string;
  message: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse extends BaseResponse<TokenData> {}
