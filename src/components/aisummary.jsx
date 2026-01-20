import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function AISummary({ content }) {
  const [summary, setSummary] = useState("");

  const summarize = async () => {
    const res = await apiFetch("/deepai/summary", {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    setSummary(res.data?.summary || res.summary);
  };

  return (
    <div>
      <button onClick={summarize}>Summarize with AI</button>
      {summary && <p>{summary}</p>}
    </div>
  );
}
