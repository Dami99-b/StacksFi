import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { prompt } = req.body || {};

  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are StackFi AI: concise, pragmatic, and focused on Stacks / DeFi advice." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 500
    });

    const answer = completion.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ answer });
  } catch (err) {
    console.error("AI error", err);
    res.status(500).json({ error: "AI failed" });
  }
}
