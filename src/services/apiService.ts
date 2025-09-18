import { db } from "./database";
import {
  Job,
  Candidate,
  Assessment,
  AssessmentResponse,
  JobFilters,
  CandidateFilters,
} from "../types";

// Simple API service that directly uses the database
// This bypasses MSW issues and provides direct access to data

// Helper function to simulate network latency and errors
const simulateNetworkDelay = async (
  minMs: number = 200,
  maxMs: number = 1200
) => {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
};

// Helper function to simulate random errors (5-10% error rate)
const shouldSimulateError = () => {
  const errorRate = 0.05 + Math.random() * 0.05; // 5-10% error rate
  return Math.random() < errorRate;
};

// Helper function to simulate write operations with latency and errors
const simulateWriteOperation = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  await simulateNetworkDelay();

  if (shouldSimulateError()) {
    throw new Error(
      "Network error: Unable to complete the operation. Please try again."
    );
  }

  return await operation();
};

export const apiService = {
  // Jobs API
  async getJobs(filters: JobFilters = {}) {
    const {
      search = "",
      status,
      page = 1,
      pageSize = 10,
      sort = "order",
      order = "asc",
    } = filters;

    let jobs = await db.jobs.orderBy(sort).toArray();

    // Apply filters
    if (search) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      jobs = jobs.filter((job) => job.status === status);
    }

    // Apply sorting
    if (order === "desc") {
      jobs = jobs.reverse();
    }

    const total = jobs.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    return {
      data: paginatedJobs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async getJobById(id: string) {
    return await db.jobs.get(id);
  },

  async createJob(jobData: Omit<Job, "id" | "createdAt" | "updatedAt">) {
    return await simulateWriteOperation(async () => {
      const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const job: Job = {
        ...jobData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      await db.jobs.add(job);
      return job;
    });
  },

  async updateJob(id: string, updates: Partial<Job>) {
    return await simulateWriteOperation(async () => {
      const job = await db.jobs.get(id);
      if (!job) {
        throw new Error("Job not found");
      }

      const updatedJob = {
        ...job,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.jobs.update(id, updatedJob);
      return updatedJob;
    });
  },

  async deleteJob(id: string) {
    return await simulateWriteOperation(async () => {
      await db.jobs.delete(id);
    });
  },

  async reorderJobs(
    id: string,
    reorderData: { fromOrder: number; toOrder: number }
  ) {
    return await simulateWriteOperation(async () => {
      const job = await db.jobs.get(id);
      if (!job) {
        throw new Error("Job not found");
      }

      // Update the job's order
      const updatedJob = {
        ...job,
        order: reorderData.toOrder,
        updatedAt: new Date().toISOString(),
      };

      await db.jobs.update(id, updatedJob);
      return updatedJob;
    });
  },

  // Candidates API
  async getCandidates(filters: CandidateFilters = {}) {
    const {
      search = "",
      stage,
      jobId,
      page = 1,
      pageSize = 10,
      sort = "name",
      order = "asc",
    } = filters;

    let candidates = await db.candidates.orderBy(sort).toArray();

    // Apply filters
    if (search) {
      candidates = candidates.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(search.toLowerCase()) ||
          candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (stage) {
      candidates = candidates.filter((candidate) => candidate.stage === stage);
    }

    if (jobId) {
      candidates = candidates.filter((candidate) => candidate.jobId === jobId);
    }

    // Apply sorting
    if (order === "desc") {
      candidates = candidates.reverse();
    }

    const total = candidates.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCandidates = candidates.slice(startIndex, endIndex);

    return {
      data: paginatedCandidates,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async getCandidateById(id: string) {
    return await db.candidates.get(id);
  },

  async createCandidate(
    candidateData: Omit<Candidate, "id" | "createdAt" | "updatedAt">
  ) {
    return await simulateWriteOperation(async () => {
      const id = `candidate_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const now = new Date().toISOString();

      const candidate: Candidate = {
        ...candidateData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      await db.candidates.add(candidate);
      return candidate;
    });
  },

  async getCandidateTimeline(candidateId: string) {
    return await db.candidateTimeline
      .where("candidateId")
      .equals(candidateId)
      .sortBy("timestamp");
  },

  async updateCandidate(id: string, updates: Partial<Candidate>) {
    return await simulateWriteOperation(async () => {
      const candidate = await db.candidates.get(id);
      if (!candidate) {
        throw new Error("Candidate not found");
      }

      const updatedCandidate = {
        ...candidate,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.candidates.update(id, updatedCandidate);
      return updatedCandidate;
    });
  },

  // Assessments API
  async getAssessmentByJob(jobId: string) {
    return await db.assessments.where("jobId").equals(jobId).first();
  },

  async createAssessment(
    assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">
  ) {
    return await simulateWriteOperation(async () => {
      const id = `assessment_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const now = new Date().toISOString();

      const assessment: Assessment = {
        ...assessmentData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      await db.assessments.add(assessment);
      return assessment;
    });
  },

  async updateAssessment(id: string, updates: Partial<Assessment>) {
    return await simulateWriteOperation(async () => {
      const assessment = await db.assessments.get(id);
      if (!assessment) {
        throw new Error("Assessment not found");
      }

      const updatedAssessment = {
        ...assessment,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.assessments.update(id, updatedAssessment);
      return updatedAssessment;
    });
  },

  async saveAssessment(
    jobId: string,
    assessmentData: Omit<Assessment, "id" | "jobId" | "createdAt" | "updatedAt">
  ) {
    return await simulateWriteOperation(async () => {
      const existingAssessment = await db.assessments
        .where("jobId")
        .equals(jobId)
        .first();

      if (existingAssessment) {
        const updatedAssessment = {
          ...existingAssessment,
          ...assessmentData,
          updatedAt: new Date().toISOString(),
        };
        await db.assessments.update(existingAssessment.id, updatedAssessment);
        return updatedAssessment;
      } else {
        const id = `assessment_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const now = new Date().toISOString();

        const assessment: Assessment = {
          ...assessmentData,
          id,
          jobId,
          createdAt: now,
          updatedAt: now,
        };

        await db.assessments.add(assessment);
        return assessment;
      }
    });
  },

  async submitAssessment(
    jobId: string,
    responseData: Omit<AssessmentResponse, "id" | "createdAt">
  ) {
    return await simulateWriteOperation(async () => {
      const id = `response_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const now = new Date().toISOString();

      const response: AssessmentResponse = {
        ...responseData,
        id,
        createdAt: now,
      };

      await db.assessmentResponses.add(response);
      return response;
    });
  },
};
