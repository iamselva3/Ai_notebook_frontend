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
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<any[]>("/notes");
      setNotes(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
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
        setDraftContent(summary);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 md:p-6">
      
      <div className="absolute inset-0 overflow-hidden">
     
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-r from-teal-500/10 to-emerald-400/15 rounded-full blur-3xl"></div>
        <div className="absolute -top-60 -right-40 w-[700px] h-[700px] bg-gradient-to-l from-teal-500/10 to-emerald-400/15 rounded-full blur-3xl"></div>
        
    
        <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-violet-400/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] bg-gradient-to-l from-purple-600/10 to-violet-500/15 rounded-full blur-3xl"></div>
        
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-b from-blue-400/10 to-cyan-300/10 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
       
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Notebook Dashboard</h1>
            <p className="text-white/70 mt-1">Your personal AI-powered notes</p>
          </div>
          
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-white/70 text-sm">Total Notes</div>
            <div className="text-2xl font-bold text-white">{notes.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-white/70 text-sm">Words in Draft</div>
            <div className="text-2xl font-bold text-white">{draftContent.trim().split(/\s+/).filter(Boolean).length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="text-white/70 text-sm">Characters</div>
            <div className="text-2xl font-bold text-white">{draftContent.length}</div>
          </div>
        </div>

      
        <div className="grid lg:grid-cols-2 gap-6">
         
          <div className="bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Create New Note
            </h2>
            
            <NoteForm
              draftContent={draftContent}
              onContentChange={setDraftContent}
              onSummarize={summarizeDraft}
              aiLoading={aiLoading}
              onCreated={loadNotes}
            />
          </div>

          
          <div className="bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-2xl border border-white/20 h-[500px] md:h-[550px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Your Notes
              </h2>
              <button
                onClick={loadNotes}
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white px-4 py-2 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 border border-white/20 flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="text-white/50 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-white/70 text-lg">No notes yet</p>
                <p className="text-white/50 text-sm mt-1">Start by creating your first note!</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto aurora-scrollbar">
                <div className="pr-2">
                  <NotesList notes={notes} onUpdate={loadNotes} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-white/50 text-sm">
          <p>Powered by AI • Your notes are securely stored</p>
        </div>
      </div>

     
    </div>
  );
}