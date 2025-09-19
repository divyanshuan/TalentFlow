import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Candidate, Job } from "../types";
import {
  UserIcon,
  CalendarIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { format, formatDistanceToNow } from "date-fns";

interface KanbanBoardProps {
  candidates: Candidate[];
  onStageChange: (candidateId: string, newStage: string) => void;
  jobs?: Job[];
}

interface CandidateCardProps {
  candidate: Candidate;
  job?: Job;
}

const CandidateCard = React.memo<CandidateCardProps>(({ candidate, job }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "applied":
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case "screen":
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case "tech":
        return <ExclamationTriangleIcon className="h-4 w-4 text-purple-500" />;
      case "offer":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "hired":
        return <CheckCircleIcon className="h-4 w-4 text-emerald-500" />;
      case "rejected":
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "applied":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "screen":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "tech":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "offer":
        return "bg-green-50 border-green-200 text-green-800";
      case "hired":
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-150 cursor-grab active:cursor-grabbing hover:border-primary-300 mb-6 ${
        isDragging ? "rotate-2 scale-105 shadow-xl z-50" : ""
      }`}
    >
      {/* Header with Avatar and Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
            {getInitials(candidate.name)}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              to={`/candidates/${candidate.id}`}
              className="text-sm font-semibold text-gray-900 hover:text-primary-600 block"
              onClick={(e) => e.stopPropagation()}
              title={candidate.name}
            >
              <div className="truncate">{candidate.name}</div>
            </Link>
            <p
              className="text-xs text-gray-500 truncate"
              title={candidate.email}
            >
              {candidate.email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
          <Link
            to={`/candidates/${candidate.id}`}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
            onClick={(e) => e.stopPropagation()}
            title="View candidate"
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <button
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            onClick={(e) => e.stopPropagation()}
            title="Add note"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Job Information */}
      {job && (
        <div className="flex items-center mb-3 p-2 bg-gray-50 rounded-lg">
          <BriefcaseIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-medium text-gray-900 truncate"
              title={job.title}
            >
              {job.title}
            </p>
            <p
              className="text-xs text-gray-500 truncate"
              title={job.location || "Remote"}
            >
              {job.location || "Remote"}
            </p>
          </div>
        </div>
      )}

      {/* Stage and Date */}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStageColor(
            candidate.stage
          )}`}
        >
          {getStageIcon(candidate.stage)}
          <span className="ml-1 capitalize">{candidate.stage}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 flex-shrink-0 ml-2">
          <CalendarIcon className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">
            {format(new Date(candidate.createdAt), "MMM dd, yyyy")}
          </span>
          <span className="sm:hidden">
            {format(new Date(candidate.createdAt), "MMM dd")}
          </span>
        </div>
      </div>

      {/* Time Since Applied */}
      <div className="mt-2 text-xs text-gray-400 truncate">
        Applied{" "}
        {formatDistanceToNow(new Date(candidate.createdAt), {
          addSuffix: true,
        })}
      </div>
    </div>
  );
});

CandidateCard.displayName = "CandidateCard";

interface StageColumnProps {
  stage: { value: string; label: string; color: string; bgColor: string };
  candidates: Candidate[];
  jobs: Job[];
}

const StageColumn = React.memo<StageColumnProps>(
  ({ stage, candidates, jobs }) => {
    const { setNodeRef, isOver } = useSortable({
      id: stage.value,
      data: { type: "column", stage: stage.value },
    });

    const getJobForCandidate = useCallback(
      (candidate: Candidate) => {
        return jobs.find((job) => job.id === candidate.jobId);
      },
      [jobs]
    );

    return (
      <div
        ref={setNodeRef}
        className={`bg-gradient-to-b from-white to-gray-50 rounded-2xl p-4 min-h-[600px] lg:min-h-[700px] border border-gray-100 shadow-sm w-full min-w-[320px] lg:min-w-[360px] relative ${
          isOver ? "bg-blue-50 border-blue-200" : ""
        }`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center flex-1 min-w-0">
            <div
              className={`w-4 h-4 rounded-full ${stage.color} mr-3 shadow-sm flex-shrink-0`}
            ></div>
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {stage.label}
            </h3>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
              stage.bgColor
            } ${stage.color.replace(
              "bg-",
              "text-"
            )} shadow-sm flex-shrink-0 ml-2`}
          >
            {candidates.length}
          </span>
        </div>

        {/* Candidates List */}
        <SortableContext
          items={candidates.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6 pb-6">
            {candidates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-gray-500 text-sm font-medium">
                  No candidates
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Drag candidates here
                </div>
              </div>
            ) : (
              candidates.map((candidate, index) => (
                <div key={candidate.id} className="relative mb-6">
                  <CandidateCard
                    candidate={candidate}
                    job={getJobForCandidate(candidate)}
                  />
                </div>
              ))
            )}
          </div>
        </SortableContext>
      </div>
    );
  }
);

StageColumn.displayName = "StageColumn";

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onStageChange,
  jobs = [],
}) => {
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(
    null
  );

  const stages = useMemo(
    () => [
      {
        value: "applied",
        label: "Applied",
        color: "bg-blue-500",
        bgColor: "bg-blue-100",
      },
      {
        value: "screen",
        label: "Screen",
        color: "bg-yellow-500",
        bgColor: "bg-yellow-100",
      },
      {
        value: "tech",
        label: "Tech Interview",
        color: "bg-purple-500",
        bgColor: "bg-purple-100",
      },
      {
        value: "offer",
        label: "Offer",
        color: "bg-green-500",
        bgColor: "bg-green-100",
      },
      {
        value: "hired",
        label: "Hired",
        color: "bg-emerald-500",
        bgColor: "bg-emerald-100",
      },
      {
        value: "rejected",
        label: "Rejected",
        color: "bg-red-500",
        bgColor: "bg-red-100",
      },
    ],
    []
  );

  const candidatesByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.value] = candidates.filter(
        (candidate) => candidate.stage === stage.value
      );
      return acc;
    }, {} as Record<string, Candidate[]>);
  }, [candidates, stages]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const candidateId = event.active.id as string;
      const candidate = candidates.find((c) => c.id === candidateId);
      setActiveCandidate(candidate || null);
    },
    [candidates]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // This helps with smooth drag over transitions
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveCandidate(null);

      if (!over) return;

      const candidateId = active.id as string;
      const newStage = over.id as string;

      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate || candidate.stage === newStage) return;

      // Optimistic update - call the handler immediately
      onStageChange(candidateId, newStage);
    },
    [candidates, onStageChange]
  );

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            Candidate Pipeline
          </h2>
          <p className="text-gray-600 mt-1">
            Manage candidates through your hiring stages
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {candidates.length}
          </div>
          <div className="text-sm text-gray-500">Total Candidates</div>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 lg:gap-12 xl:gap-16 overflow-x-auto pb-6">
          {stages.map((stage) => (
            <StageColumn
              key={stage.value}
              stage={stage}
              candidates={candidatesByStage[stage.value] || []}
              jobs={jobs}
            />
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeCandidate ? (
            <div className="rotate-6 scale-105 opacity-95 shadow-2xl">
              <CandidateCard
                candidate={activeCandidate}
                job={jobs.find((j) => j.id === activeCandidate.jobId)}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
