import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCandidates } from "../hooks/useCandidates";
import { CandidateFilters } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import {
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  FunnelIcon,
  XMarkIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const CandidatesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [stage, setStage] = useState(searchParams.get("stage") || "");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );

  const filters: CandidateFilters = {
    search: search || undefined,
    stage: (stage as any) || undefined,
    page: currentPage,
    pageSize: 10, // Use pagination instead of virtualization
  };

  const { data: candidatesData, isLoading, error } = useCandidates(filters);
  const candidates = candidatesData?.data || [];
  const totalPages = candidatesData?.totalPages || 1;
  const total = candidatesData?.total || 0;

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when searching
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const handleStageFilter = (value: string) => {
    setStage(value);
    setCurrentPage(1); // Reset to first page when filtering
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set("stage", value);
    } else {
      newSearchParams.delete("stage");
    }
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setSearch("");
    setStage("");
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "screen":
        return "bg-yellow-100 text-yellow-800";
      case "tech":
        return "bg-purple-100 text-purple-800";
      case "offer":
        return "bg-green-100 text-green-800";
      case "hired":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const hasActiveFilters = search || stage;

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">
          Error loading candidates: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-0">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-4 lg:p-8 border border-primary-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 shadow-lg">
                <UserGroupIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              Candidates
            </h1>
            <p className="mt-2 text-gray-600 text-base lg:text-lg">
              Manage candidate applications and track their progress
            </p>
          </div>
          <div className="text-left lg:text-right">
            <div className="flex items-center text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
              <ChartBarIcon className="h-6 w-6 lg:h-8 lg:w-8 mr-2 text-primary-500" />
              {total}
            </div>
            <div className="text-sm text-gray-600">Total Candidates</div>
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
                placeholder="Search candidates by name or email..."
                className="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Stage Filter */}
            <div className="relative">
              <ChartBarIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                className="block w-full rounded-lg border-0 py-3 pl-10 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 appearance-none bg-white"
                value={stage}
                onChange={(e) => handleStageFilter(e.target.value)}
              >
                <option value="">All Stages</option>
                <option value="applied">Applied</option>
                <option value="screen">Screen</option>
                <option value="tech">Tech Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
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
                    onClick={() => handleSearch("")}
                    className="ml-2 h-4 w-4 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              {stage && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Stage: {stage}
                  <button
                    onClick={() => handleStageFilter("")}
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

      {/* Candidates List */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-gray-600" />
            {total} Candidates Found
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing page {currentPage} of {totalPages}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {hasActiveFilters
                ? "No candidates match your current filters."
                : "No candidates are available at the moment."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/candidates/${candidate.id}`}
                          className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {candidate.name}
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-sm text-gray-500 space-y-1 sm:space-y-0">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{candidate.email}</span>
                          </div>
                          {candidate.phone && (
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>{candidate.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <BriefcaseIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>Job ID: {candidate.jobId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStageColor(
                          candidate.stage
                        )}`}
                      >
                        {candidate.stage}
                      </span>
                      <div className="text-sm text-gray-500">
                        Applied:{" "}
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-4 lg:px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
