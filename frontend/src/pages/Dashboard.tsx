import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import {
  Building2,
  Calendar,
  ChevronRight,
  Crown,
  Plus,
  RefreshCw,
  Users,
} from 'lucide-react';
import { createOrganization, listOrganizations } from '../api/organization.api';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import type { ApiError, Organization } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create organization modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await listOrganizations();
      if (Array.isArray(res.data)) {
        setOrganizations(res.data);
      } else {
        setOrganizations([]);
      }
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch your organizations.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const trimmed = newOrgName.trim();
    if (trimmed.length < 2) {
      setModalError('Organization name must contain at least 2 characters.');
      return;
    }
    if (trimmed.length > 120) {
      setModalError('Organization name must not exceed 120 characters.');
      return;
    }

    setIsCreating(true);
    try {
      await createOrganization({ name: trimmed });
      setNewOrgName('');
      setIsModalOpen(false);
      await fetchOrganizations();
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.message) {
        setModalError(err.response.data.message);
      } else {
        setModalError('Failed to create organization. Please try again.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
            Organizations
          </h1>
          <p className="text-sm text-slate-400">
            Select or create an organization to manage role permissions and memberships.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrganizations}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh organizations"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setModalError(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Organization</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Loading state */}
      {isLoading && organizations.length === 0 && (
        <LoadingSpinner message="Loading your organizations..." size="lg" />
      )}

      {/* Empty state */}
      {!isLoading && organizations.length === 0 && !error && (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="You are not an active member of any organization yet. Create your first organization to get started."
          action={{
            label: 'Create Organization',
            onClick: () => setIsModalOpen(true),
          }}
        />
      )}

      {/* Organization Cards Grid */}
      {!isLoading && organizations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {organizations.map((org) => {
            const isOwner = user?.id === org.ownerId;
            const formattedDate = new Date(org.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={org.id}
                className="group relative bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    {isOwner && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Crown className="w-3 h-3" />
                        Owner
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors capitalize">
                    {org.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Created {formattedDate}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <Link
                    to={`/organizations/${org.id}`}
                    className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    View Settings
                  </Link>
                  <Link
                    to={`/organizations/${org.id}/members`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium transition-all group/btn"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Members</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Organization Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isCreating) {
            setIsModalOpen(false);
            setModalError(null);
          }
        }}
        title="Create New Organization"
        description="Organizations group teams and allow you to delegate roles and permissions."
      >
        {modalError && (
          <div className="mb-4">
            <Alert type="error" message={modalError} onClose={() => setModalError(null)} />
          </div>
        )}

        <form onSubmit={handleCreateOrg} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="org-name">
              Organization Name
            </label>
            <input
              id="org-name"
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              autoFocus
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">2 to 120 characters</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={isCreating}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isCreating && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>Create Organization</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
