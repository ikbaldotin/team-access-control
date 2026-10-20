import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Edit2,
  KeyRound,
  Trash2,
  Users,
} from 'lucide-react';
import {
  deleteOrganization,
  getOrganization,
  updateOrganization,
} from '../api/organization.api';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { ApiError, Organization } from '../types';

export const OrganizationDetails: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [org, setOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit organization modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete organization modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchOrganizationDetails = React.useCallback(async () => {
    if (!organizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await getOrganization(organizationId);
      if (res.data) {
        setOrg(res.data);
        setEditName(res.data.name);
      } else {
        setError('Organization not found or access denied.');
      }
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch organization details.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchOrganizationDetails();
  }, [fetchOrganizationDetails]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;
    setEditError(null);

    const trimmed = editName.trim();
    if (trimmed.length < 2 || trimmed.length > 120) {
      setEditError('Name must be between 2 and 120 characters.');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateOrganization(organizationId, { name: trimmed });
      if (res.data?.organization) {
        setOrg(res.data.organization);
      }
      setIsEditModalOpen(false);
      setSuccessMessage(res.message || 'Organization updated successfully');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setEditError(err.response.data.message);
      } else {
        setEditError('Failed to update organization.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!organizationId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteOrganization(organizationId);
      setIsDeleteModalOpen(false);
      navigate('/', { replace: true });
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setDeleteError(err.response.data.message);
      } else {
        setDeleteError('Failed to delete organization.');
      }
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading organization settings..." size="lg" />;
  }

  const isOwner = user?.id === org?.ownerId;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Organizations</span>
        </Link>
      </div>

      {/* Global Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}

      {org && (
        <>
          {/* Main Organization Header */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white capitalize tracking-tight">
                  {org.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Organization ID: <span className="text-slate-300">{org.id}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/organizations/${org.id}/members`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
              >
                <Users className="w-4 h-4" />
                <span>Manage Members</span>
              </Link>
              <button
                onClick={() => {
                  setEditError(null);
                  setEditName(org.name);
                  setIsEditModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4 text-slate-400" />
                <span>Rename</span>
              </button>
            </div>
          </div>

          {/* Details Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <span>Ownership & Access</span>
              </h2>
              <dl className="space-y-3 text-xs">
                <div>
                  <dt className="text-slate-500">Owner User ID</dt>
                  <dd className="font-mono text-slate-200 mt-0.5 break-all">
                    {org.ownerId} {isOwner && <span className="text-indigo-400 font-sans font-semibold">(You)</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Your Privileges</dt>
                  <dd className="text-slate-300 mt-0.5">
                    {isOwner
                      ? 'Full Owner Access (Read, Update, Delete, Invite, Suspend)'
                      : 'Role-based access enforced by backend RBAC'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Timestamps</span>
              </h2>
              <dl className="space-y-3 text-xs">
                <div>
                  <dt className="text-slate-500">Created At</dt>
                  <dd className="font-mono text-slate-200 mt-0.5">
                    {new Date(org.createdAt).toLocaleString()}
                  </dd>
                </div>
                {org.updatedAt && (
                  <div>
                    <dt className="text-slate-500">Last Updated</dt>
                    <dd className="font-mono text-slate-200 mt-0.5">
                      {new Date(org.updatedAt).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-500/20 bg-red-950/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Danger Zone</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Soft-delete this organization. You must have <code className="text-slate-300">ORGANIZATION_DELETE</code> permissions.
                </p>
              </div>
              <button
                onClick={() => {
                  setDeleteError(null);
                  setIsDeleteModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors self-start sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Organization</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Organization Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!isUpdating) setIsEditModalOpen(false);
        }}
        title="Rename Organization"
        description="Update your organization display name."
      >
        {editError && (
          <div className="mb-4">
            <Alert type="error" message={editError} onClose={() => setEditError(null)} />
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="edit-org-name">
              Organization Name
            </label>
            <input
              id="edit-org-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) setIsDeleteModalOpen(false);
        }}
        title="Confirm Organization Deletion"
        description="Are you sure you want to delete this organization? This action will mark it as deleted."
      >
        {deleteError && (
          <div className="mb-4">
            <Alert type="error" message={deleteError} onClose={() => setDeleteError(null)} />
          </div>
        )}

        <div className="py-2 text-sm text-slate-300">
          This will revoke access for all members under <span className="font-bold text-white">&quot;{org?.name}&quot;</span>.
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>Yes, Delete</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
