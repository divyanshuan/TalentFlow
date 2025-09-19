import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCandidates } from "../hooks/useCandidates";
import { useCandidateTimeline } from "../hooks/useCandidates";
import { useUpdateCandidate } from "../hooks/useCandidates";
import { useJobs } from "../hooks/useJobs";
import LoadingSpinner from "../components/LoadingSpinner";
import NotesPanel from "../components/NotesPanel";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  LinkIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const CandidateDetailPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStage, setEditedStage] = useState("");

  const { data: candidatesData, isLoading: candidatesLoading } = useCandidates({
    page: 1,
    pageSize: 1000,
  });
  const { data: jobsData } = useJobs({
    page: 1,
    pageSize: 1000,
  });
  const { data: timelineData, isLoading: timelineLoading } =
    useCandidateTimeline(candidateId || "");
  const updateCandidateMutation = useUpdateCandidate();

  const candidate = candidatesData?.data.find((c) => c.id === candidateId);
  const timeline = timelineData || [];

  const handleStageChange = async (newStage: string) => {
    if (candidate) {
      try {
        await updateCandidateMutation.mutateAsync({
          id: candidate.id,
          updates: { stage: newStage as any },
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating candidate stage:", error);
      }
    }
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

  const stages = [
    { value: "applied", label: "Applied", color: "bg-blue-500" },
    { value: "screen", label: "Screen", color: "bg-yellow-500" },
    { value: "tech", label: "Tech", color: "bg-purple-500" },
    { value: "offer", label: "Offer", color: "bg-green-500" },
    { value: "hired", label: "Hired", color: "bg-emerald-500" },
    { value: "rejected", label: "Rejected", color: "bg-red-500" },
  ];

  if (candidatesLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Candidate not found
        </h2>
        <p className="mt-2 text-gray-600">
          The candidate you're looking for doesn't exist.
        </p>
        <Link
          to="/candidates"
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/candidates"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Candidates
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {candidate.name}
            </h1>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStageColor(
                  candidate.stage
                )}`}
              >
                {candidate.stage}
              </span>
              <span>
                Applied {new Date(candidate.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <select
                value={editedStage}
                onChange={(e) => setEditedStage(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {stages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleStageChange(editedStage)}
                disabled={updateCandidateMutation.isPending}
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedStage("");
                }}
                className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditedStage(candidate.stage);
              }}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Stage
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-sm text-gray-900">{candidate.email}</div>
                </div>
              </div>
              {candidate.phone && (
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Phone
                    </div>
                    <div className="text-sm text-gray-900">
                      {candidate.phone}
                    </div>
                  </div>
                </div>
              )}
              {candidate.linkedin && (
                <div className="flex items-center">
                  <LinkIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      LinkedIn
                    </div>
                    <a
                      href={candidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
              {candidate.portfolio && (
                <div className="flex items-center">
                  <LinkIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Portfolio
                    </div>
                    <a
                      href={candidate.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      View Portfolio
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <NotesPanel
            candidate={candidate}
            jobs={jobsData?.data || []}
            onAddNote={(note) => {
              console.log("Note added:", note);
              // In a real app, this would save to the backend
            }}
          />

          {/* Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
            {timelineLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : timeline.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {timeline.map((event: any, eventIdx: number) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== timeline.length - 1 ? (
                          <span
                            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                stages.find((s) => s.value === event.stage)
                                  ?.color || "bg-gray-500"
                              }`}
                            >
                              <div className="h-2 w-2 bg-white rounded-full" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Stage changed to{" "}
                                <span
                                  className={`font-medium ${getStageColor(
                                    event.stage
                                  )} px-2 py-1 rounded-full text-xs`}
                                >
                                  {event.stage}
                                </span>
                              </p>
                              {event.notes && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {event.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No timeline events yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Candidate Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-500">Candidate</p>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Job Application
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Job ID</div>
                <div className="text-sm text-gray-900 font-mono">
                  {candidate.jobId}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Applied</div>
                <div className="text-sm text-gray-900">
                  {new Date(candidate.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Last Updated
                </div>
                <div className="text-sm text-gray-900">
                  {new Date(candidate.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={`/jobs/${candidate.jobId}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-500"
              >
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                View Job Details
              </Link>
            </div>
          </div>

          {/* Stage Progress */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Hiring Pipeline
            </h3>
            <div className="space-y-3">
              {stages.map((stage) => (
                <div key={stage.value} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      candidate.stage === stage.value
                        ? stage.color
                        : stages.findIndex((s) => s.value === candidate.stage) >
                          stages.findIndex((s) => s.value === stage.value)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      candidate.stage === stage.value
                        ? "font-medium text-gray-900"
                        : stages.findIndex((s) => s.value === candidate.stage) >
                          stages.findIndex((s) => s.value === stage.value)
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
