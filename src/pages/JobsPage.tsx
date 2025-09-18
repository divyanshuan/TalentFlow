import React, { useState } from "react";
import { useJobs } from "../hooks/useJobs";
import { JobFilters, Job } from "../types";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon,
  XMarkIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

const JobsPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    pageSize: 12,
    sort: "order",
    order: "asc",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const { data: jobsData, isLoading, error } = useJobs(filters);
  const jobs = jobsData?.data || [];
  const totalPages = jobsData?.totalPages || 1;
  const total = jobsData?.total || 0;

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleStatusFilter = (status: JobFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleJobEdit = (job: Job) => {
    setEditingJob(job);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingJob(null);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 12,
      sort: "order",
      order: "asc",
    });
  };

  const hasActiveFilters = filters.search || filters.status;

  // Calculate statistics
  const stats = {
    total: total,
    active: jobs.filter((job) => job.status === "active").length,
    archived: jobs.filter((job) => job.status === "archived").length,
  };

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">
          Error loading jobs: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-4 lg:p-8 border border-primary-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg">
                <BriefcaseIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              Job Postings
            </h1>
            <p className="mt-2 text-gray-600 text-base lg:text-lg">
              Create and manage your job postings to attract top talent
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
            <div className="text-left lg:text-right">
              <div className="flex items-center text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                <ChartBarIcon className="h-6 w-6 lg:h-8 lg:w-8 mr-2 text-primary-500" />
                {total}
              </div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-primary-700 hover:to-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create New Job
            </button>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {stats.total}
                </div>
                <div className="text-xs text-primary-800 font-medium">
                  Total Jobs
                </div>
              </div>
              <BriefcaseIcon className="h-8 w-8 text-primary-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.active}
                </div>
                <div className="text-xs text-green-800 font-medium">Active</div>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {stats.archived}
                </div>
                <div className="text-xs text-gray-800 font-medium">
                  Archived
                </div>
              </div>
              <ArchiveBoxIcon className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
              Filters & Search
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title or description..."
                className="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                value={filters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                className="block w-full rounded-lg border-0 py-3 pl-10 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 appearance-none bg-white"
                value={filters.status || ""}
                onChange={(e) =>
                  handleStatusFilter(
                    (e.target.value as JobFilters["status"]) || undefined
                  )
                }
              >
                <option value="">All Status</option>
                <option value="active">Active Jobs</option>
                <option value="archived">Archived Jobs</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleSearch("")}
                    className="ml-2 h-4 w-4 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Status: {filters.status}
                  <button
                    onClick={() => handleStatusFilter(undefined)}
                    className="ml-2 h-4 w-4 text-green-600 hover:text-green-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-600" />
            {total} Jobs Found
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing page {filters.page} of {totalPages}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {hasActiveFilters
                ? "No jobs match your current filters."
                : "Create your first job posting to get started."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-sm font-semibold text-white shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Job
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onEdit={handleJobEdit} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Pagination
                currentPage={filters.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <JobModal
          isOpen={showCreateModal}
          onClose={handleModalClose}
          job={null}
        />
      )}
      {editingJob && (
        <JobModal
          isOpen={!!editingJob}
          onClose={handleModalClose}
          job={editingJob}
        />
      )}
    </div>
  );
};

export default JobsPage;
