import apiClient from './axios';
import type {
  AddMemberDTO,
  ApiResponse,
  MemberItem,
  MembershipRecord,
  UpdateMemberRoleDTO,
} from '../types';

export const addMember = async (
  organizationId: string,
  data: AddMemberDTO
): Promise<ApiResponse<MembershipRecord>> => {
  const response = await apiClient.post<ApiResponse<MembershipRecord>>(
    `/membership/${organizationId}`,
    data
  );
  return response.data;
};

export const listMembers = async (
  organizationId: string
): Promise<ApiResponse<MemberItem[]>> => {
  const response = await apiClient.get<ApiResponse<MemberItem[]>>(
    `/membership/${organizationId}`
  );
  return response.data;
};

export const removeMember = async (
  organizationId: string,
  userId: string
): Promise<ApiResponse<{ userId: string; organizationId: string; status: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ userId: string; organizationId: string; status: string }>
  >(`/membership/${organizationId}/${userId}`);
  return response.data;
};

export const updateMemberRole = async (
  organizationId: string,
  userId: string,
  data: UpdateMemberRoleDTO
): Promise<ApiResponse<{ userId: string; organizationId: string; roleId: string; status: string }>> => {
  const response = await apiClient.patch<
    ApiResponse<{ userId: string; organizationId: string; roleId: string; status: string }>
  >(`/membership/${organizationId}/${userId}/role`, data);
  return response.data;
};

export const reactivateMember = async (
  organizationId: string,
  userId: string
): Promise<ApiResponse<{ userId: string; organizationId: string; status: string }>> => {
  const response = await apiClient.patch<
    ApiResponse<{ userId: string; organizationId: string; status: string }>
  >(`/membership/${organizationId}/${userId}/reactivate`);
  return response.data;
};

export const getMemberDetails = async (
  organizationId: string,
  userId: string
): Promise<ApiResponse<MemberItem>> => {
  const response = await apiClient.get<ApiResponse<MemberItem>>(
    `/membership/${organizationId}/${userId}`
  );
  return response.data;
};
