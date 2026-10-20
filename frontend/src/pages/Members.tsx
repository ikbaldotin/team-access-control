import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import {
  ArrowLeft,
  Check,
  Mail,
  PlayCircle,
  RefreshCw,
  Shield,
  StopCircle,
  UserPlus,
  Users,
} from 'lucide-react';
import { useMembers } from '../hooks/useMembers';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import { RoleBadge, StatusBadge } from '../components/Badge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import type { ApiError, MemberItem } from '../types';

export const Members: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { user: currentUser } = useAuth();
  const orgId = organizationId || '';

  const {
    members,
    isLoading,
    error,
    refreshMembers,
    addNewMember,
    suspendMember,
    reactivateOldMember,
    changeMemberRole,
  } = useMembers(orgId);

  // Success / Action feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Add Member Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Change Role Modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
  const [targetRole, setTargetRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Suspend / Reactivate Confirmation Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusTargetMember, setStatusTargetMember] = useState<MemberItem | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState(false);


  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!addEmail.trim() || !emailRegex.test(addEmail.trim())) {
      setActionError('Please enter a valid email address.');
      return;
    }

    setIsAdding(true);
    try {
      await addNewMember(addEmail.trim().toLowerCase());
      setAddEmail('');
      setIsAddModalOpen(false);
      showSuccess('Member invited successfully!');
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setActionError(err.response.data.message);
      } else {
        setActionError('Failed to add member to organization.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setActionError(null);
    setIsUpdatingRole(true);

    try {
      await changeMemberRole(selectedMember.userId, targetRole);
      setIsRoleModalOpen(false);
      setSelectedMember(null);
      showSuccess(`Role updated to ${targetRole}`);
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setActionError(err.response.data.message);
      } else {
        setActionError('Failed to update member role.');
      }
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!statusTargetMember) return;
    setActionError(null);
    setIsChangingStatus(true);

    try {
      if (statusTargetMember.status === 'ACTIVE') {
        await suspendMember(statusTargetMember.userId);
        showSuccess('Member suspended successfully');
      } else {
        await reactivateOldMember(statusTargetMember.userId);
        showSuccess('Member reactivated successfully');
      }
      setIsStatusModalOpen(false);
      setStatusTargetMember(null);
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setActionError(err.response.data.message);
      } else {
        setActionError('Failed to change member status.');
      }
    } finally {
      setIsChangingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          to={`/organizations/${orgId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Organization Settings</span>
        </Link>
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-400" />
            <span>Team Members</span>
          </h1>
          <p className="text-sm text-slate-400">
            View active & suspended memberships, invite team members, and manage access roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshMembers()}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh member list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setActionError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => {}} />}
      {actionError && (
        <Alert type="error" message={actionError} onClose={() => setActionError(null)} />
      )}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Loading state */}
      {isLoading && members.length === 0 && (
        <LoadingSpinner message="Fetching organization members..." size="lg" />
      )}

      {/* Empty state */}
      {!isLoading && members.length === 0 && !error && (
        <EmptyState
          icon={Users}
          title="No members found"
          description="This organization does not have any members listed. Invite members using their registered email."
          action={{
            label: 'Add Member',
            onClick: () => setIsAddModalOpen(true),
          }}
        />
      )}

      {/* Members Table */}
      {!isLoading && members.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {members.map((member) => {
                  const isCurrent = member.userId === currentUser?.id;
                  const isOwner = member.role.toUpperCase() === 'OWNER';
                  const isSuspended = member.status === 'SUSPENDED';
                  const formattedDate = new Date(member.joinedAt).toLocaleDateString(
                    undefined,
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }
                  );

                  return (
                    <tr
                      key={member.userId}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Email & ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-xs text-indigo-400">
                            {member.email.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white flex items-center gap-2">
                              <span>{member.email}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-sans">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {member.userId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <RoleBadge role={member.role} />
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <StatusBadge status={member.status} />
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                        {formattedDate}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Role Change Button */}
                          <button
                            disabled={isOwner || isSuspended}
                            onClick={() => {
                              setSelectedMember(member);
                              setTargetRole(
                                member.role.toUpperCase() === 'ADMIN' ? 'MEMBER' : 'ADMIN'
                              );
                              setIsRoleModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-700 text-xs font-medium text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title={
                              isOwner
                                ? 'Owner role cannot be changed'
                                : isSuspended
                                ? 'Cannot modify role of suspended member'
                                : 'Update member role'
                            }
                          >
                            <Shield className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Role</span>
                          </button>

                          {/* Suspend or Reactivate Button */}
                          <button
                            disabled={isOwner}
                            onClick={() => {
                              setStatusTargetMember(member);
                              setIsStatusModalOpen(true);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                              isSuspended
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                : 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                            }`}
                            title={
                              isOwner
                                ? 'The owner cannot be suspended or removed'
                                : isSuspended
                                ? 'Reactivate member'
                                : 'Suspend member'
                            }
                          >
                            {isSuspended ? (
                              <>
                                <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Reactivate</span>
                              </>
                            ) : (
                              <>
                                <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                                <span>Suspend</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (!isAdding) setIsAddModalOpen(false);
        }}
        title="Add Team Member"
        description="Enter the email address of a registered user to add them to this organization."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="member-email">
              User Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="member-email"
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                autoFocus
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              The user must already have a registered account in Team Access Control. New members start with the <code className="text-slate-300">MEMBER</code> role.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={isAdding}
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {isAdding && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>Add to Team</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => {
          if (!isUpdatingRole) {
            setIsRoleModalOpen(false);
            setSelectedMember(null);
          }
        }}
        title="Update Member Role"
        description={`Modify access role for ${selectedMember?.email || 'member'}.`}
      >
        <form onSubmit={handleRoleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Select Target Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['ADMIN', 'MEMBER'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    targetRole === role
                      ? 'border-indigo-500 bg-indigo-600/15 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-sm flex items-center justify-between">
                    <span>{role}</span>
                    {targetRole === role && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {role === 'ADMIN'
                      ? 'Full team & invite management'
                      : 'Standard member read access'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={isUpdatingRole}
              onClick={() => setIsRoleModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingRole}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdatingRole && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>Apply Role</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Suspend / Reactivate Confirmation Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => {
          if (!isChangingStatus) {
            setIsStatusModalOpen(false);
            setStatusTargetMember(null);
          }
        }}
        title={
          statusTargetMember?.status === 'ACTIVE'
            ? 'Confirm Member Suspension'
            : 'Confirm Member Reactivation'
        }
        description={
          statusTargetMember?.status === 'ACTIVE'
            ? `Suspend ${statusTargetMember?.email}'s access to this organization.`
            : `Restore active access for ${statusTargetMember?.email}.`
        }
      >
        <div className="py-2 text-sm text-slate-300">
          {statusTargetMember?.status === 'ACTIVE' ? (
            <p>
              Suspended members cannot view or manage organization resources until reactivated by an admin or owner.
            </p>
          ) : (
            <p>
              The member will be returned to active status and will regain their organization access privileges.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            disabled={isChangingStatus}
            onClick={() => setIsStatusModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isChangingStatus}
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 ${
              statusTargetMember?.status === 'ACTIVE'
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isChangingStatus && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>
              {statusTargetMember?.status === 'ACTIVE' ? 'Suspend Member' : 'Reactivate Member'}
            </span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
