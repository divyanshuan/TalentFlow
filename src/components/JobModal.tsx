import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateJob, useUpdateJob } from "../hooks/useJobs";
import { Job } from "../types";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

interface JobFormData {
  title: string;
  slug: string;
  status: "active" | "archived";
  description: string;
  location: string;
  salary: string;
  tags: string[];
  requirements: string[];
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, job }) => {
  const [tagsInput, setTagsInput] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");

  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>();

  const title = watch("title");

  // Generate slug from title
  useEffect(() => {
    if (title && !job) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  }, [title, setValue, job]);

  // Reset form when modal opens/closes or job changes
  useEffect(() => {
    if (isOpen) {
      if (job) {
        reset({
          title: job.title,
          slug: job.slug,
          status: job.status,
          description: job.description || "",
          location: job.location || "",
          salary: job.salary || "",
          tags: job.tags || [],
          requirements: job.requirements || [],
        });
        setTagsInput(job.tags?.join(", ") || "");
        setRequirementsInput(job.requirements?.join("\n") || "");
      } else {
        reset({
          title: "",
          slug: "",
          status: "active",
          description: "",
          location: "",
          salary: "",
          tags: [],
          requirements: [],
        });
        setTagsInput("");
        setRequirementsInput("");
      }
    }
  }, [isOpen, job, reset]);

  const onSubmit = async (data: JobFormData) => {
    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      const requirements = requirementsInput
        .split("\n")
        .filter((req) => req.trim());

      const jobData = {
        ...data,
        tags,
        requirements,
        order: job?.order || 0,
      };

      if (job) {
        await updateJobMutation.mutateAsync({ id: job.id, updates: jobData });
      } else {
        await createJobMutation.mutateAsync(jobData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {job ? "Edit Job" : "Create New Job"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title *
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL Slug *
                  </label>
                  <input
                    {...register("slug", { required: "Slug is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., senior-frontend-developer"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Describe the role and responsibilities..."
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    {...register("location")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Range
                  </label>
                  <input
                    {...register("salary")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="e.g., $100,000 - $130,000"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="React, TypeScript, Frontend (comma-separated)"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <textarea
                    value={requirementsInput}
                    onChange={(e) => setRequirementsInput(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="One requirement per line..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={
                  createJobMutation.isPending || updateJobMutation.isPending
                }
                className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createJobMutation.isPending || updateJobMutation.isPending
                  ? "Saving..."
                  : job
                  ? "Update Job"
                  : "Create Job"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
