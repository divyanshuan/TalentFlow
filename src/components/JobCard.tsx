import React from "react";
import { Link } from "react-router-dom";
import { Job } from "../types";
import {
  PencilIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit }) => {
  const getStatusColor = (status: Job["status"]) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
            >
              {job.title}
            </Link>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {job.location || "Remote"}
              </div>
              {job.salary && (
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  {job.salary}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                job.status
              )}`}
            >
              {job.status}
            </span>
            <button
              onClick={() => onEdit(job)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {job.description && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-3">
              {job.description}
            </p>
          </div>
        )}

        {job.tags && job.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {job.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  +{job.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <BriefcaseIcon className="h-4 w-4 mr-1" />
            Created {new Date(job.createdAt).toLocaleDateString()}
          </div>
          <Link
            to={`/jobs/${job.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
