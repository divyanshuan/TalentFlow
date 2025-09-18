import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";
import { useCandidates } from "../hooks/useCandidates";
import { useAssessment } from "../hooks/useAssessments";
import LoadingSpinner from "../components/LoadingSpinner";
import JobModal from "../components/JobModal";
import {
  PencilIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: jobsData, isLoading: jobsLoading } = useJobs({
    page: 1,
    pageSize: 1000,
  });
  const { data: candidatesData, isLoading: candidatesLoading } = useCandidates({
    jobId: jobId || "",
    page: 1,
    pageSize: 100,
  });
  const { data: assessmentData, isLoading: assessmentLoading } = useAssessment(
    jobId || ""
  );

  const job = jobsData?.data.find((j) => j.id === jobId);
  const candidates = candidatesData?.data || [];

  if (jobsLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
        <p className="mt-2 text-gray-600">
          The job you're looking for doesn't exist.
        </p>
        <Link
          to="/jobs"
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const stageCounts = candidates.reduce((acc, candidate) => {
    acc[candidate.stage] = (acc[candidate.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/jobs"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  job.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {job.status}
              </span>
              {job.location && <span>{job.location}</span>}
              {job.salary && <span>{job.salary}</span>}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {job.description || "No description provided."}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Requirements
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Assessment */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Assessment</h2>
              <Link
                to={`/jobs/${job.id}/assessment`}
                className="inline-flex items-center text-primary-600 hover:text-primary-500"
              >
                <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                Manage Assessment
              </Link>
            </div>
            {assessmentLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : assessmentData ? (
              <div className="text-sm text-gray-600">
                <p className="mb-2">Assessment: {assessmentData.title}</p>
                <p>
                  {assessmentData.sections.length} sections with{" "}
                  {assessmentData.sections.reduce(
                    (acc: number, section: any) =>
                      acc + section.questions.length,
                    0
                  )}{" "}
                  questions
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No assessment created yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Job Details
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(job.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">URL Slug</dt>
                <dd className="text-sm text-gray-900 font-mono">{job.slug}</dd>
              </div>
              {job.tags && job.tags.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Candidate Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Candidates</h3>
              <Link
                to={`/candidates?jobId=${job.id}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-500"
              >
                <UsersIcon className="h-4 w-4 mr-1" />
                View All
              </Link>
            </div>
            {candidatesLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-gray-900">
                  {candidates.length} Total
                </div>
                <div className="space-y-2">
                  {Object.entries(stageCounts).map(([stage, count]) => (
                    <div
                      key={stage}
                      className="flex items-center justify-between"
                    >
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          stage
                        )}`}
                      >
                        {stage}
                      </span>
                      <span className="text-sm text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <JobModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          job={job}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
