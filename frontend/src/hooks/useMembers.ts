import { useCallback, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import {
  addMember,
  listMembers,
  reactivateMember,
  removeMember,
  updateMemberRole,
} from '../api/membership.api';
import type { ApiError, MemberItem } from '../types';

export const useMembers = (organizationId: string) => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await listMembers(organizationId);
      // The backend returns `{ success: true, message: "...", result: [...] }`
      if (res.result) {
        setMembers(res.result);
      } else if (Array.isArray(res.data)) {
        setMembers(res.data as unknown as MemberItem[]);
      } else {
        setMembers([]);
      }
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch members');
      }
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addNewMember = async (email: string) => {
    await addMember(organizationId, { email });
    await fetchMembers();
  };

  const suspendMember = async (userId: string) => {
    await removeMember(organizationId, userId);
    await fetchMembers();
  };

  const reactivateOldMember = async (userId: string) => {
    await reactivateMember(organizationId, userId);
    await fetchMembers();
  };

  const changeMemberRole = async (userId: string, roleCode: 'ADMIN' | 'MEMBER') => {
    await updateMemberRole(organizationId, userId, { roleCode });
    await fetchMembers();
  };

  return {
    members,
    isLoading,
    error,
    refreshMembers: fetchMembers,
    addNewMember,
    suspendMember,
    reactivateOldMember,
    changeMemberRole,
  };
};
