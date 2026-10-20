import apiClient from './axios';
import type { ApiResponse, AuthResponseData, LoginDTO, RegisterDTO } from '../types';

export const registerUser = async (data: RegisterDTO): Promise<ApiResponse<AuthResponseData>> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginDTO): Promise<ApiResponse<AuthResponseData>> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
  return response.data;
};
