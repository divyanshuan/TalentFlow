import React, { useState, useCallback } from "react";
import MentionsTextarea from "./MentionsTextarea";
import { ChatBubbleLeftRightIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Candidate, Job } from "../types";

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  mentions: string[];
}

interface NotesPanelProps {
  candidate: Candidate;
  jobs: Job[];
  onAddNote?: (note: Note) => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  candidate,
  jobs,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Create mentions list from candidates and jobs
  const mentions = React.useMemo(() => {
    const candidateMentions = [
      {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
      },
    ];

    const jobMentions = jobs.map((job) => ({
      id: job.id,
      name: job.title,
      email: `${job.title.toLowerCase().replace(/\s+/g, "")}@company.com`,
    }));

    return [...candidateMentions, ...jobMentions];
  }, [candidate, jobs]);

  const handleAddNote = useCallback(() => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: newNote.trim(),
      author: "Current User", // In a real app, this would come from auth context
      createdAt: new Date().toISOString(),
      mentions: [], // Extract mentions from content
    };

    onAddNote?.(note);
    setNewNote("");
    setIsAddingNote(false);
  }, [newNote, onAddNote]);

  const handleCancel = useCallback(() => {
    setNewNote("");
    setIsAddingNote(false);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-gray-600" />
            Notes
          </h3>
          {!isAddingNote && (
            <button
              onClick={() => setIsAddingNote(true)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Note
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {isAddingNote ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a note about {candidate.name}
              </label>
              <MentionsTextarea
                value={newNote}
                onChange={setNewNote}
                placeholder={`Add a note about ${candidate.name}...`}
                mentions={mentions}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              No notes yet
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Add notes to track important information about {candidate.name}
            </p>
            <button
              onClick={() => setIsAddingNote(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;
