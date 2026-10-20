export type MembershipStatus = 'ACTIVE' | 'SUSPENDED';

export type RoleCode = 'OWNER' | 'ADMIN' | 'MEMBER' | string;

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface MemberItem {
  userId: string;
  email: string;
  role: RoleCode;
  status: MembershipStatus;
  joinedAt: string;
  organizationId?: string;
}

export interface MembershipRecord {
  id?: string;
  userId: string;
  organizationId: string;
  roleId?: string;
  status: MembershipStatus;
  joinedAt?: string;
  joinedAT?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  result?: T;
  membership?: T;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface CreateOrganizationDTO {
  name: string;
}

export interface UpdateOrganizationDTO {
  name: string;
}

export interface AddMemberDTO {
  email: string;
}

export interface UpdateMemberRoleDTO {
  roleCode: 'ADMIN' | 'MEMBER';
}
