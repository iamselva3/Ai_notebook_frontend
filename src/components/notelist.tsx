import { useState } from "react";
import { apiFetch } from "../lib/api";
import { toast } from "react-toastify";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
};

export default function NotesList({ notes, onUpdate }: { notes: Note[], onUpdate: () => void }) {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const toggleExpand = (noteId: string) => {
    setExpandedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const summarize = async (note: Note) => {
    if (note.content.trim().length < 20) {
      toast.warning("Note must be at least 20 characters to summarize");
      return;
    }

    try {
      setLoadingId(note._id);

      const res = await apiFetch<any>("/deepai/summary", {
        method: "POST",
        body: JSON.stringify({ content: note.content }),
      });

      const summary = res.data?.summary || res.summary;

      setSummaries((prev) => ({
        ...prev,
        [note._id]: summary,
      }));

      toast.success("Summary generated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate summary");
    } finally {
      setLoadingId(null);
    }
  };

  const startEdit = (note: Note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async (noteId: string) => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.warning("Title and content are required");
      return;
    }

    try {
      setLoadingId(noteId);
      
      await apiFetch(`/notes/${noteId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim(),
        }),
      });

      toast.success("Note updated successfully");
      setEditingNoteId(null);
      setEditTitle("");
      setEditContent("");
      onUpdate(); // Refresh the notes list
    } catch (err: any) {
      toast.error(err.message || "Failed to update note");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setDeletingNoteId(noteId);
      
      await apiFetch(`/notes/${noteId}`, {
        method: "DELETE",
      });

      toast.success("Note deleted successfully");
      onUpdate(); // Refresh the notes list
    } catch (err: any) {
      toast.error(err.message || "Failed to delete note");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-white/70 text-lg">No notes yet</p>
        <p className="text-white/50 text-sm mt-1">Create your first note to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Your Notes</h3>
        <div className="text-white/60 text-sm">
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note, index) => {
          const isExpanded = expandedNotes[note._id];
          const isEditing = editingNoteId === note._id;
          const displayContent = isExpanded 
            ? note.content 
            : note.content.length > 150 
              ? note.content.substring(0, 150) + '...' 
              : note.content;
          
          const canSummarize = note.content.trim().length >= 20;
          const hasSummary = summaries[note._id];
          
          return (
            <div
              key={note._id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            >
              {/* Note Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                    {isEditing ? (
                      <input
                        className="text-lg font-bold text-white bg-white/10 border border-white/20 rounded px-2 py-1 w-full focus:outline-none focus:border-blue-400"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Note title"
                      />
                    ) : (
                      <h4 className="text-lg font-bold text-white truncate">
                        {note.title}
                      </h4>
                    )}
                  </div>
                  {note.createdAt && !isEditing && (
                    <div className="text-xs text-white/50">
                      {formatDate(note.createdAt)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                      {note.content.split(/\s+/).filter(Boolean).length} words
                    </span>
                  )}
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Note Content */}
              <div className={`mb-3 ${hasSummary && !isEditing ? 'max-h-[100px] overflow-hidden' : ''}`}>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[120px] p-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-blue-400 resize-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Note content..."
                  />
                ) : (
                  <>
                    <p className="text-white/80 text-sm whitespace-pre-wrap">
                      {displayContent}
                    </p>
                    {note.content.length > 150 && !hasSummary && (
                      <button
                        onClick={() => toggleExpand(note._id)}
                        className="text-blue-300 hover:text-blue-200 text-xs mt-1 inline-flex items-center gap-1 transition-colors duration-150"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => summarize(note)}
                      disabled={loadingId === note._id || !canSummarize}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                        ${loadingId === note._id
                          ? 'bg-purple-600/30 text-purple-300 cursor-wait'
                          : canSummarize
                            ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 hover:text-purple-200 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/30'
                            : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 cursor-not-allowed'
                        }
                      `}
                    >
                      {loadingId === note._id ? (
                        <>
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Summarize with AI
                          {!canSummarize && (
                            <span className="text-xs ml-1">(need 20 chars)</span>
                          )}
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => startEdit(note)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 hover:text-blue-200 hover:from-blue-600/30 hover:to-cyan-600/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-blue-500/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>

                    <button
                      onClick={() => deleteNote(note._id)}
                      disabled={deletingNoteId === note._id}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 text-red-300 hover:text-red-200 hover:from-red-600/30 hover:to-pink-600/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingNoteId === note._id ? (
                        <>
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => saveEdit(note._id)}
                      disabled={loadingId === note._id || !editTitle.trim() || !editContent.trim()}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-300 hover:text-green-200 hover:from-green-600/30 hover:to-emerald-600/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingId === note._id ? (
                        <>
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save
                        </>
                      )}
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 hover:text-gray-200 hover:from-gray-600/30 hover:to-gray-700/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-500/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </div>

              {/* AI Summary Section */}
              {hasSummary && !isEditing && (
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-sm font-medium text-purple-300">AI Summary</span>
                  </div>
                  <p className="text-white/90 text-sm">
                    {hasSummary}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}