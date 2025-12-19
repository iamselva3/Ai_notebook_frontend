import { useState } from "react";
import { apiFetch } from "../lib/api";
import { toast } from "react-toastify";

type Note = {
  _id: string;
  title: string;
  content: string;
};

export default function NotesList({ notes }: { notes: Note[] }) {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  if (notes.length === 0) {
    return <p className="text-gray-500">No notes yet.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Your Notes</h3>

      <div className="space-y-4">
        {notes.map((note, index) => (
          <div
            key={note._id}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <h4 className="text-lg font-bold mb-2">
              {index + 1}. {note.title}
            </h4>

            <p className="text-gray-700 mb-3 whitespace-pre-wrap">
              {note.content}
            </p>

            <button
              onClick={() => summarize(note)}
              disabled={loadingId === note._id}
              className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loadingId === note._id ? "Summarizing..." : "Summarize"}
            </button>

            {summaries[note._id] && (
              <div className="mt-3 p-3 bg-white border rounded">
                <p className="text-sm text-gray-800">
                  <strong>AI Summary:</strong> {summaries[note._id]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
