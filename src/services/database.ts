import Dexie, { Table } from "dexie";
import {
  Job,
  Candidate,
  Assessment,
  AssessmentResponse,
  CandidateTimelineEvent,
  Note,
} from "../types";

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;
  candidateTimeline!: Table<CandidateTimelineEvent>;
  notes!: Table<Note>;

  constructor() {
    super("TalentFlowDB");

    this.version(1).stores({
      jobs: "id, title, slug, status, order, createdAt, updatedAt",
      candidates: "id, name, email, stage, jobId, createdAt, updatedAt",
      assessments: "id, jobId, title, createdAt, updatedAt",
      assessmentResponses:
        "id, assessmentId, candidateId, submittedAt, createdAt",
      candidateTimeline: "id, candidateId, stage, timestamp",
      notes: "id, candidateId, createdAt, createdBy",
    });
  }
}

export const db = new TalentFlowDB();

// Helper functions for database operations
export const dbHelpers = {
  async clearAllData() {
    await db.transaction(
      "rw",
      [
        db.jobs,
        db.candidates,
        db.assessments,
        db.assessmentResponses,
        db.candidateTimeline,
        db.notes,
      ],
      async () => {
        await db.jobs.clear();
        await db.candidates.clear();
        await db.assessments.clear();
        await db.assessmentResponses.clear();
        await db.candidateTimeline.clear();
        await db.notes.clear();
      }
    );
  },

  async getJobBySlug(slug: string): Promise<Job | undefined> {
    return await db.jobs.where("slug").equals(slug).first();
  },

  async getCandidatesByJob(jobId: string): Promise<Candidate[]> {
    return await db.candidates.where("jobId").equals(jobId).toArray();
  },

  async getCandidatesByStage(stage: string): Promise<Candidate[]> {
    return await db.candidates.where("stage").equals(stage).toArray();
  },

  async getAssessmentByJob(jobId: string): Promise<Assessment | undefined> {
    return await db.assessments.where("jobId").equals(jobId).first();
  },

  async getCandidateTimeline(
    candidateId: string
  ): Promise<CandidateTimelineEvent[]> {
    return await db.candidateTimeline
      .where("candidateId")
      .equals(candidateId)
      .sortBy("timestamp");
  },

  async addTimelineEvent(
    event: Omit<CandidateTimelineEvent, "id">
  ): Promise<void> {
    const id = `timeline_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    await db.candidateTimeline.add({ ...event, id });
  },

  async updateCandidateStage(
    candidateId: string,
    newStage: string
  ): Promise<void> {
    const candidate = await db.candidates.get(candidateId);
    if (candidate) {
      await db.candidates.update(candidateId, {
        stage: newStage as any,
        updatedAt: new Date().toISOString(),
      });

      // Add timeline event
      await this.addTimelineEvent({
        candidateId,
        stage: newStage as any,
        timestamp: new Date().toISOString(),
        notes: `Stage changed to ${newStage}`,
      });
    }
  },
};
