export interface Job {
  id: string;
  title: string;
  slug: string;
  status: "active" | "archived";
  tags: string[];
  order: number;
  description?: string;
  requirements?: string[];
  location?: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: "applied" | "screen" | "tech" | "offer" | "hired" | "rejected";
  jobId: string;
  resume?: string;
  linkedin?: string;
  portfolio?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateTimelineEvent {
  id: string;
  candidateId: string;
  stage: Candidate["stage"];
  timestamp: string;
  notes?: string;
  userId?: string;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: AssessmentQuestion[];
  order: number;
}

export interface AssessmentQuestion {
  id: string;
  type:
    | "single-choice"
    | "multi-choice"
    | "short-text"
    | "long-text"
    | "numeric"
    | "file-upload";
  title: string;
  description?: string;
  required: boolean;
  options?: string[]; // For single/multi choice
  min?: number; // For numeric
  max?: number; // For numeric
  maxLength?: number; // For text
  conditional?: {
    questionId: string;
    operator:
      | "equals"
      | "not-equals"
      | "contains"
      | "greater-than"
      | "less-than";
    value: any;
  };
  order: number;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: QuestionResponse[];
  submittedAt?: string;
  createdAt: string;
}

export interface QuestionResponse {
  questionId: string;
  value: any;
  submittedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JobFilters {
  search?: string;
  status?: Job["status"];
  tags?: string[];
  page?: number;
  pageSize?: number;
  sort?: "title" | "createdAt" | "order";
  order?: "asc" | "desc";
}

export interface CandidateFilters {
  search?: string;
  stage?: Candidate["stage"];
  jobId?: string;
  page?: number;
  pageSize?: number;
  sort?: "name" | "email" | "createdAt";
  order?: "asc" | "desc";
}

export interface ReorderRequest {
  fromOrder: number;
  toOrder: number;
}

export interface Note {
  id: string;
  candidateId: string;
  content: string;
  mentions: string[]; // User IDs or names
  createdAt: string;
  createdBy: string;
}
