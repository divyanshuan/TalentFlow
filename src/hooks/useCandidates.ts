import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/apiService";
import { Candidate, CandidateFilters } from "../types";

export const useCandidates = (filters: CandidateFilters = {}) => {
  return useQuery({
    queryKey: ["candidates", filters],
    queryFn: () => apiService.getCandidates(filters),
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      candidate: Omit<Candidate, "id" | "createdAt" | "updatedAt">
    ) => apiService.createCandidate(candidate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
};

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Candidate>;
    }) => apiService.updateCandidate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
};

export const useCandidateTimeline = (candidateId: string) => {
  return useQuery({
    queryKey: ["candidates", candidateId, "timeline"],
    queryFn: () => apiService.getCandidateTimeline(candidateId),
    enabled: !!candidateId,
  });
};
