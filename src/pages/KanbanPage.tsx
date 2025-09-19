import React, { useState } from "react";
import { useCandidates } from "../hooks/useCandidates";
import { useJobs } from "../hooks/useJobs";
import { useUpdateCandidate } from "../hooks/useCandidates";
import KanbanBoard from "../components/KanbanBoard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  ChartBarIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const KanbanPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");

  // Fetch jobs for the dropdown
  const { data: jobsData } = useJobs({
    page: 1,
    pageSize: 1000,
    sort: "title",
    order: "asc",
  });

  const { data: candidatesData, isLoading } = useCandidates({
    search: search || undefined,
    jobId: selectedJob || undefined,
    stage: (selectedStage as any) || undefined,
    page: 1,
    pageSize: 1000,
  });

  const updateCandidateMutation = useUpdateCandidate();

  const candidates = candidatesData?.data || [];
  const jobs = jobsData?.data || [];

  const handleStageChange = async (candidateId: string, newStage: string) => {
    try {
      await updateCandidateMutation.mutateAsync({
        id: candidateId,
        updates: { stage: newStage as any },
      });
    } catch (error) {
      console.error("Error updating candidate stage:", error);
    }
  };

  // Calculate statistics
  const stats = {
    total: candidates.length,
    applied: candidates.filter((c) => c.stage === "applied").length,
    screen: candidates.filter((c) => c.stage === "screen").length,
    tech: candidates.filter((c) => c.stage === "tech").length,
    offer: candidates.filter((c) => c.stage === "offer").length,
    hired: candidates.filter((c) => c.stage === "hired").length,
    rejected: candidates.filter((c) => c.stage === "rejected").length,
  };

  const stages = [
    { value: "applied", label: "Applied", color: "bg-blue-500" },
    { value: "screen", label: "Screen", color: "bg-yellow-500" },
    { value: "tech", label: "Tech", color: "bg-purple-500" },
    { value: "offer", label: "Offer", color: "bg-green-500" },
    { value: "hired", label: "Hired", color: "bg-emerald-500" },
    { value: "rejected", label: "Rejected", color: "bg-red-500" },
  ];

  const clearFilters = () => {
    setSearch("");
    setSelectedJob("");
    setSelectedStage("");
  };

  const hasActiveFilters = search || selectedJob || selectedStage;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
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
                <UserGroupIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              Candidate Pipeline
            </h1>
            <p className="mt-2 text-gray-600 text-base lg:text-lg">
              Visualize and manage your hiring process with drag-and-drop
              simplicity
            </p>
          </div>
          <div className="text-left lg:text-right">
            <div className="flex items-center text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
              <ArrowTrendingUpIcon className="h-6 w-6 lg:h-8 lg:w-8 mr-2 text-green-500" />
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Active Candidates</div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl lg:text-2xl font-bold text-blue-600">
                  {stats.applied}
                </div>
                <div className="text-xs text-blue-800 font-medium">Applied</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl lg:text-2xl font-bold text-yellow-600">
                  {stats.screen}
                </div>
                <div className="text-xs text-yellow-800 font-medium">
                  Screen
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl lg:text-2xl font-bold text-purple-600">
                  {stats.tech}
                </div>
                <div className="text-xs text-purple-800 font-medium">Tech</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl lg:text-2xl font-bold text-green-600">
                  {stats.offer}
                </div>
                <div className="text-xs text-green-800 font-medium">Offer</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl lg:text-2xl font-bold text-emerald-600">
                  {stats.hired}
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  Hired
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 lg:p-4 shadow-sm border border-red-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl lg:text-2xl font-bold text-red-600">
                  {stats.rejected}
                </div>
                <div className="text-xs text-red-800 font-medium">Rejected</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                className="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Job Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                className="block w-full rounded-lg border-0 py-3 pl-10 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 appearance-none bg-white"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage Filter */}
            <div className="relative">
              <ChartBarIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                className="block w-full rounded-lg border-0 py-3 pl-10 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 appearance-none bg-white"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                <option value="">All Stages</option>
                {stages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  Search: "{search}"
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 h-4 w-4 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedJob && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Job:{" "}
                  {jobs.find((j) => j.id === selectedJob)?.title || "Unknown"}
                  <button
                    onClick={() => setSelectedJob("")}
                    className="ml-2 h-4 w-4 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedStage && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Stage:{" "}
                  {stages.find((s) => s.value === selectedStage)?.label ||
                    "Unknown"}
                  <button
                    onClick={() => setSelectedStage("")}
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

      {/* Kanban Board */}
      <KanbanBoard
        candidates={candidates}
        onStageChange={handleStageChange}
        jobs={jobs}
      />
    </div>
  );
};

export default KanbanPage;
