import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAssessment, useSaveAssessment } from "../hooks/useAssessments";
import { Assessment, AssessmentSection, AssessmentQuestion } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import AssessmentPreview from "../components/AssessmentPreview";
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const AssessmentBuilderPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [assessment, setAssessment] = useState<
    Omit<Assessment, "id" | "jobId" | "createdAt" | "updatedAt">
  >({
    title: "",
    description: "",
    sections: [],
  });
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  const { data: assessmentData, isLoading } = useAssessment(jobId || "");
  const saveAssessmentMutation = useSaveAssessment();

  useEffect(() => {
    if (assessmentData) {
      setAssessment({
        title: assessmentData.title,
        description: assessmentData.description || "",
        sections: assessmentData.sections,
      });
    }
  }, [assessmentData]);

  const addSection = () => {
    const newSection: Omit<AssessmentSection, "id"> = {
      title: "New Section",
      description: "",
      questions: [],
      order: assessment.sections.length,
    };

    setAssessment((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { ...newSection, id: `section-${Date.now()}` },
      ],
    }));
    setSelectedSectionId(`section-${Date.now()}`);
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<AssessmentSection>
  ) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  };

  const deleteSection = (sectionId: string) => {
    setAssessment((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  };

  const addQuestion = (sectionId: string) => {
    const section = assessment.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newQuestion: Omit<AssessmentQuestion, "id"> = {
      type: "short-text",
      title: "New Question",
      description: "",
      required: false,
      order: section.questions.length,
    };

    updateSection(sectionId, {
      questions: [
        ...section.questions,
        { ...newQuestion, id: `question-${Date.now()}` },
      ],
    });
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updates: Partial<AssessmentQuestion>
  ) => {
    const section = assessment.sections.find((s) => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      questions: section.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const section = assessment.sections.find((s) => s.id === sectionId);
    if (!section) return;

    updateSection(sectionId, {
      questions: section.questions.filter((q) => q.id !== questionId),
    });
  };

  const saveAssessment = async () => {
    if (!jobId) return;

    try {
      await saveAssessmentMutation.mutateAsync({
        jobId,
        assessment,
      });
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  };

  const selectedSection = assessment.sections.find(
    (s) => s.id === selectedSectionId
  );
  const selectedQuestion = selectedSection?.questions.find(
    (q) => q.id === selectedQuestionId
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to={`/jobs/${jobId}`}
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Job
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assessment Builder
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and customize assessment questions for this job
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={saveAssessment}
            disabled={saveAssessmentMutation.isPending}
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
          >
            {saveAssessmentMutation.isPending ? "Saving..." : "Save Assessment"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder */}
        <div className="space-y-6">
          {/* Assessment Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Assessment Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={assessment.title}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Assessment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={assessment.description}
                  onChange={(e) =>
                    setAssessment((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Assessment description"
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Sections</h2>
              <button
                onClick={addSection}
                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Section
              </button>
            </div>

            <div className="space-y-4">
              {assessment.sections.map((section) => (
                <div
                  key={section.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSectionId === section.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedSectionId(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {section.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {section.questions.length} questions
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addQuestion(section.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Editor */}
          {selectedSection && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Section Editor
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={selectedSection.title}
                    onChange={(e) =>
                      updateSection(selectedSection.id, {
                        title: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={selectedSection.description || ""}
                    onChange={(e) =>
                      updateSection(selectedSection.id, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Questions
                </h3>
                <div className="space-y-4">
                  {selectedSection.questions.map((question) => (
                    <div
                      key={question.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedQuestionId === question.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedQuestionId(question.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {question.title}
                            </h4>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                              {question.type}
                            </span>
                            {question.required && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                Required
                              </span>
                            )}
                          </div>
                          {question.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {question.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteQuestion(selectedSection.id, question.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Question Editor */}
          {selectedQuestion && selectedSection && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Question Editor
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question Type
                  </label>
                  <select
                    value={selectedQuestion.type}
                    onChange={(e) =>
                      updateQuestion(selectedSection.id, selectedQuestion.id, {
                        type: e.target.value as any,
                        options: e.target.value.includes("choice")
                          ? selectedQuestion.options || []
                          : undefined,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="short-text">Short Text</option>
                    <option value="long-text">Long Text</option>
                    <option value="single-choice">Single Choice</option>
                    <option value="multi-choice">Multiple Choice</option>
                    <option value="numeric">Numeric</option>
                    <option value="file-upload">File Upload</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question Title
                  </label>
                  <input
                    type="text"
                    value={selectedQuestion.title}
                    onChange={(e) =>
                      updateQuestion(selectedSection.id, selectedQuestion.id, {
                        title: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={selectedQuestion.description || ""}
                    onChange={(e) =>
                      updateQuestion(selectedSection.id, selectedQuestion.id, {
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedQuestion.required}
                    onChange={(e) =>
                      updateQuestion(selectedSection.id, selectedQuestion.id, {
                        required: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Required question
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-6">
            <AssessmentPreview assessment={assessment} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;
