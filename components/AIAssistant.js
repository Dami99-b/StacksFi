import { useState } from "react";

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!prompt) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setAnswer(data?.answer || "No answer returned.");
    } catch (err) {
      console.error(err);
      setAnswer("AI error or OPENAI_API_KEY not set.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card mt-6">
      <h3 className="text-2xl font-bold mb-3">AI DeFi Assistant</h3>
      <textarea
        rows={3}
        className="w-full p-3 rounded-lg bg-[#0b0b12] text-white"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask StackFi AI about DeFi opportunities, sBTC, or how to use Stacks..."
      />
      <div className="flex items-center gap-3 mt-4">
        <button onClick={askAI} disabled={loading} className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 font-semibold">
          {loading ? "Analyzing..." : "Ask AI"}
        </button>
        <button onClick={() => { setPrompt(""); setAnswer(""); }} className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300">
          Clear
        </button>
      </div>

      {answer && (
        <div className="mt-4 bg-[#090712] p-4 rounded-md text-gray-300 whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}
