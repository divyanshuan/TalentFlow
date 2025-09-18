import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import { Assessment, AssessmentResponse } from "../types";

export const useAssessment = (jobId: string) => {
  return useQuery({
    queryKey: ["assessments", jobId],
    queryFn: () => apiService.getAssessmentByJob(jobId),
    enabled: !!jobId,
  });
};

export const useSaveAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      assessment,
    }: {
      jobId: string;
      assessment: Omit<Assessment, "id" | "jobId" | "createdAt" | "updatedAt">;
    }) => apiService.saveAssessment(jobId, assessment),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ["assessments", jobId] });
    },
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      response,
    }: {
      jobId: string;
      response: Omit<AssessmentResponse, "id" | "createdAt">;
    }) => apiService.submitAssessment(jobId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
};
