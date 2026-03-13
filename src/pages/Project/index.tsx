import Button from '@/Component/Button/Button';
import PageLayout from '@/Component/Layout/PageLayout';
import { Filter, Plus, Search as SearchIcon, Grid3x3, LayoutList } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { ProjectCardsGrid } from './Components/cards';
import NewProjectModal from './Components/NewProjectModal';
import { useCreateProject, useGetAllProject } from '@/pages/utils/services/project/useProject';
import { Project } from '@/pages/utils/services/project/project.api';

const Project = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const { data, isLoading, isError } = useGetAllProject();

  const { mutateAsync: handleCreateProject, isPending } = useCreateProject(() => {
    setShowNewProjectModal(false);
  });

  const projects: Project[] = data?.data ?? [];

  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status?.toLowerCase() === "completed").length;
    const inProgress = projects.filter((p) => p.status?.toLowerCase() === "active" || p.status?.toLowerCase() === "in progress").length;
    const inReview = projects.filter((p) => p.status?.toLowerCase() === "review" || p.status?.toLowerCase() === "in review").length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const inProgressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;
    const inReviewRate = total > 0 ? Math.round((inReview / total) * 100) : 0;

    return { total, completed, inProgress, inReview, completionRate, inProgressRate, inReviewRate };
  }, [projects]);

  return (
    <>
      <PageLayout title="Projects" showSearch={false} contentClassName='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="mt-1 text-gray-400">
                Manage and track all your projects in one place
              </p>
            </div>

            <Button
              title="New Project"
              icon={<Plus size={20} />}
              onClick={() => setShowNewProjectModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
              <p className="text-sm font-medium text-blue-700">Total Projects</p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-blue-200" />
              ) : (
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
              )}
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
              <p className="text-sm font-medium text-green-700">Completed</p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-green-200" />
              ) : (
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.completed}</p>
              )}
              <p className="text-xs text-green-600 mt-1">
                {isLoading ? "—" : `${stats.completionRate}% completion rate`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
              <p className="text-sm font-medium text-yellow-700">In Progress</p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-yellow-200" />
              ) : (
                <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.inProgress}</p>
              )}
              <p className="text-xs text-yellow-600 mt-1">
                {isLoading ? "—" : `${stats.inProgressRate}% of projects`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
              <p className="text-sm font-medium text-purple-700">In Review</p>
              {isLoading ? (
                <div className="mt-2 h-9 w-12 animate-pulse rounded-lg bg-purple-200" />
              ) : (
                <p className="text-3xl font-bold text-purple-900 mt-2">{stats.inReview}</p>
              )}
              <p className="text-xs text-purple-600 mt-1">
                {isLoading ? "—" : `${stats.inReviewRate}% of projects`}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <SearchIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search projects by name, status, or team member..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                  showFilters
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Filter size={18} />
                Filters
              </button>

              <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white/10 text-blue-400 shadow-sm'
                      : 'text-gray-400'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-md p-2 transition-all ${
                    viewMode === 'list'
                      ? 'bg-white/10 text-blue-400 shadow-sm'
                      : 'text-gray-400'
                  }`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-4 gap-3 border-t border-white/10 pt-4">
                <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                  <option className="bg-[#111118]">All Statuses</option>
                  <option className="bg-[#111118]">In Progress</option>
                  <option className="bg-[#111118]">Review</option>
                  <option className="bg-[#111118]">Completed</option>
                </select>

                <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                  <option className="bg-[#111118]">All Priorities</option>
                  <option className="bg-[#111118]">High</option>
                  <option className="bg-[#111118]">Medium</option>
                  <option className="bg-[#111118]">Low</option>
                </select>

                <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                  <option className="bg-[#111118]">Any Team Size</option>
                  <option className="bg-[#111118]">1-2 members</option>
                  <option className="bg-[#111118]">3-5 members</option>
                </select>

                <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                  <option className="bg-[#111118]">Recent First</option>
                  <option className="bg-[#111118]">Due Date</option>
                  <option className="bg-[#111118]">Progress</option>
                </select>
              </div>
            )}
          </div>

          <ProjectCardsGrid
            data={data}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </PageLayout>

      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={handleCreateProject}
        isLoading={isPending}
      />
    </>
  );
};

export default Project;