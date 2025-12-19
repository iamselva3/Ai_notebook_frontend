import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/notebook";
import NotesList from "../components/notelist";
import AISummary from "../components/aisummary";

export default function Dashboard() {
  const nav = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [draftContent, setDraftContent] = useState("");

  const loadNotes = async () => {
    const data = await apiFetch<any[]>("/notes");
    setNotes(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
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
            onCreated={loadNotes}
            onContentChange={setDraftContent}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <NotesList notes={notes} />
        </div>
      </div>

      {draftContent.trim().length >= 20 && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <AISummary content={draftContent} />
        </div>
      )}
    </div>
  );
}
