import { useState } from "react";
import { apiFetch } from "../lib/api";
import { toast } from "react-toastify";

type NoteFormProps = {
  onCreated: () => void;
  onContentChange: (content: string) => void;
};

export default function NoteForm({
  onCreated,
  onContentChange,
}: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    onContentChange(value); // 🔑 expose draft content to Dashboard
  };

  const submit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.warning("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      toast.success("Note created successfully");

      setTitle("");
      setContent("");
      onContentChange(""); // reset AI preview
      onCreated();
    } catch (err: any) {
      toast.error(err.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Create Note</h3>

      <div className="space-y-4">
        <input
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full min-h-[120px] p-2 border rounded resize-none focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
        />

        <div className="flex justify-end">
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
