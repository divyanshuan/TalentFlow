import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import { Job, JobFilters, ReorderRequest } from "../types";

export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => apiService.getJobs(filters),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (job: Omit<Job, "id" | "createdAt" | "updatedAt">) =>
      apiService.createJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Job> }) =>
      apiService.updateJob(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useReorderJobs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reorderData,
    }: {
      id: string;
      reorderData: ReorderRequest;
    }) => apiService.reorderJobs(id, reorderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
