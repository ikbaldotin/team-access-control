import apiClient from './axios';
import type {
  ApiResponse,
  CreateOrganizationDTO,
  Organization,
  UpdateOrganizationDTO,
} from '../types';

export const createOrganization = async (
  data: CreateOrganizationDTO
): Promise<ApiResponse<{ organization: Organization }>> => {
  const response = await apiClient.post<ApiResponse<{ organization: Organization }>>(
    '/organization/',
    data
  );
  return response.data;
};

export const listOrganizations = async (): Promise<ApiResponse<Organization[]>> => {
  const response = await apiClient.get<ApiResponse<Organization[]>>('/organization/list');
  return response.data;
};

export const getOrganization = async (
  organizationId: string
): Promise<ApiResponse<Organization | null>> => {
  const response = await apiClient.get<ApiResponse<Organization | null>>(
    `/organization/${organizationId}`
  );
  return response.data;
};

export const updateOrganization = async (
  organizationId: string,
  data: UpdateOrganizationDTO
): Promise<ApiResponse<{ organization: Organization }>> => {
  const response = await apiClient.patch<ApiResponse<{ organization: Organization }>>(
    `/organization/update/${organizationId}`,
    data
  );
  return response.data;
};

export const deleteOrganization = async (
  organizationId: string
): Promise<ApiResponse<void>> => {
  const response = await apiClient.patch<ApiResponse<void>>(
    `/organization/delete/${organizationId}`
  );
  return response.data;
};
