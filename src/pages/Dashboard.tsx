import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/notebook";
import NotesList from "../components/notelist";
import { toast } from "react-toastify";

export default function Dashboard() {
  const nav = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [draftContent, setDraftContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const loadNotes = async () => {
    const data = await apiFetch<any[]>("/notes");
    setNotes(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  const summarizeDraft = async () => {
    if (draftContent.trim().length < 20) {
      toast.warning("Write at least 20 characters to summarize");
      return;
    }

    try {
      setAiLoading(true);

      const res = await apiFetch<any>("/deepai/summary", {
        method: "POST",
        body: JSON.stringify({ content: draftContent }),
      });

      const summary = res.data?.summary || res.summary;

      if (summary) {
        setDraftContent(summary); // 🔥 REWRITE textarea
        toast.success("Draft summarized");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to summarize");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <NoteForm
            draftContent={draftContent}
            onContentChange={setDraftContent}
            onSummarize={summarizeDraft}
            aiLoading={aiLoading}
            onCreated={loadNotes}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <NotesList notes={notes} />
        </div>
      </div>
    </div>
  );
}
