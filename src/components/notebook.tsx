import { useState } from "react";
import { apiFetch } from "../lib/api";
import { toast } from "react-toastify";

type Props = {
  draftContent: string;
  onContentChange: (v: string) => void;
  onSummarize: () => void;
  aiLoading: boolean;
  onCreated: () => void;
};

export default function NoteForm({
  draftContent,
  onContentChange,
  onSummarize,
  aiLoading,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim() || !draftContent.trim()) {
      toast.warning("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify({ title, content: draftContent }),
      });

      toast.success("Note saved");

      setTitle("");
      onContentChange("");
      onCreated();
    } catch (err: any) {
      toast.error(err.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Create Note</h3>

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full min-h-[140px] p-2 border rounded resize-none"
        placeholder="Write your note..."
        value={draftContent}
        onChange={(e) => onContentChange(e.target.value)}
      />

      <div className="flex justify-between mt-3">
        <button
          onClick={onSummarize}
          disabled={aiLoading}
          className="text-sm bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {aiLoading ? "Summarizing..." : "Summarize"}
        </button>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Note"}
        </button>
      </div>
    </div>
  );
}
