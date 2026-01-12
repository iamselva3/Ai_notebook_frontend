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
    <div className="space-y-4">
     
      <div>
        <label className="block text-white/80 mb-2 text-sm font-medium">
          Note Title
        </label>
        <input
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-white/80 mb-2 text-sm font-medium">
          Note Content
        </label>
        <textarea
          className="w-full min-h-[200px] p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 resize-none"
          placeholder="Write your note content here..."
          value={draftContent}
          onChange={(e) => onContentChange(e.target.value)}
        />
        
       
        <div className="flex justify-end mt-2">
          <span className={`text-xs ${draftContent.length < 20 ? 'text-amber-400' : 'text-white/60'}`}>
            {draftContent.length} characters
          </span>
        </div>
      </div>

 
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onSummarize}
          disabled={aiLoading || draftContent.length < 20}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
        >
          {aiLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Summarizing with AI...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Summarize with AI
            </>
          )}
        </button>

        <button
          onClick={submit}
          disabled={loading || !title.trim() || !draftContent.trim()}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Note...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Note
            </>
          )}
        </button>
      </div>

     
      <div className="pt-2">
        <div className="text-xs text-white/50 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400/60"></div>
            <span>Write at least 20 characters to enable AI summarization</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400/60"></div>
            <span>Both title and content are required to save a note</span>
          </div>
        </div>
      </div>
    </div>
  );
}