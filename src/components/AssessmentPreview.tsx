import React, { useState } from "react";
import { Assessment, AssessmentQuestion } from "../types";

interface AssessmentPreviewProps {
  assessment: Omit<Assessment, "id" | "jobId" | "createdAt" | "updatedAt">;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({
  assessment,
}) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    const value = responses[question.id] || "";

    switch (question.type) {
      case "short-text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        );

      case "long-text":
        return (
          <textarea
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            rows={4}
            placeholder="Enter your answer..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        );

      case "single-choice":
        return (
          <div className="mt-2 space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}-${index}`}
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) =>
                    handleResponseChange(question.id, e.target.value)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label
                  htmlFor={`${question.id}-${index}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "multi-choice":
        return (
          <div className="mt-2 space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${question.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleResponseChange(question.id, newValues);
                  }}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`${question.id}-${index}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case "numeric":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            min={question.min}
            max={question.max}
            placeholder="Enter a number..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        );

      case "file-upload":
        return (
          <div className="mt-2">
            <input
              type="file"
              onChange={(e) =>
                handleResponseChange(
                  question.id,
                  e.target.files?.[0]?.name || ""
                )
              }
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {value && (
              <p className="mt-1 text-sm text-gray-600">Selected: {value}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Assessment Preview
      </h2>

      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {assessment.title || "Untitled Assessment"}
        </h3>
        {assessment.description && (
          <p className="mt-2 text-gray-600">{assessment.description}</p>
        )}
      </div>

      <div className="space-y-8">
        {assessment.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h4 className="text-lg font-medium text-gray-900">
                {section.title}
              </h4>
              {section.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {section.description}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {section.questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {question.title}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {question.description && (
                    <p className="text-sm text-gray-600">
                      {question.description}
                    </p>
                  )}
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          disabled
          className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm opacity-50 cursor-not-allowed"
        >
          Submit Assessment (Preview Mode)
        </button>
        <p className="mt-2 text-xs text-gray-500 text-center">
          This is a preview. Responses are not saved.
        </p>
      </div>
    </div>
  );
};

export default AssessmentPreview;
