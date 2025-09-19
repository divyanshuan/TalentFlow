import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAssessment, useSubmitAssessment } from "../hooks/useAssessments";
import { AssessmentQuestion, QuestionResponse } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";

const AssessmentFormPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: assessmentData, isLoading } = useAssessment(jobId || "");
  const submitAssessmentMutation = useSubmitAssessment();

  const { handleSubmit } = useForm();

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const onSubmit = async () => {
    if (!assessmentData || !jobId) return;

    try {
      const questionResponses: QuestionResponse[] = Object.entries(
        responses
      ).map(([questionId, value]) => ({
        questionId,
        value,
        submittedAt: new Date().toISOString(),
      }));

      await submitAssessmentMutation.mutateAsync({
        jobId,
        response: {
          assessmentId: assessmentData.id,
          candidateId: "demo-candidate", // In a real app, this would come from auth
          responses: questionResponses,
          submittedAt: new Date().toISOString(),
        },
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting assessment:", error);
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          No Assessment Found
        </h2>
        <p className="mt-2 text-gray-600">
          No assessment has been created for this job yet.
        </p>
        <Link
          to={`/jobs/${jobId}`}
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Job
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Assessment Submitted
        </h2>
        <p className="mt-2 text-gray-600">
          Thank you for completing the assessment. We'll review your responses
          and get back to you soon.
        </p>
        <Link
          to={`/jobs/${jobId}`}
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Job
        </Link>
      </div>
    );
  }

  const assessment = assessmentData;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/jobs/${jobId}`}
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Job
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {assessment.title}
          </h1>
          {assessment.description && (
            <p className="mt-1 text-sm text-gray-500">
              {assessment.description}
            </p>
          )}
        </div>
      </div>

      {/* Assessment Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-lg p-6 space-y-8"
      >
        {assessment.sections.map((section: any) => (
          <div key={section.id} className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {section.description}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {section.questions.map((question: any) => (
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

        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitAssessmentMutation.isPending}
            className="w-full rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitAssessmentMutation.isPending
              ? "Submitting..."
              : "Submit Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentFormPage;
