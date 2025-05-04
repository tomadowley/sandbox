import type { VercelRequest, VercelResponse } from '@vercel/node';

// Use node-fetch as fallback for older Node versions (not needed in Node 18+ / Vercel edge, but safe)
let _fetch: typeof fetch;
try {
  _fetch = fetch;
} catch {
  _fetch = require("node-fetch") as typeof fetch;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health check/test endpoint
  if (req.method === "GET") {
    res.status(200).json({ pong: true, env: process.env.VERCEL_ENV || null });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Keep key server-side only
  const apiKey = "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";

  try {
    // Defensive: always parse body if it's a string
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (parseErr: any) {
        console.error("Failed to parse req.body:", req.body, parseErr);
        res.status(400).json({ error: "Invalid JSON in body." });
        return;
      }
    }
    console.log("OPENAI proxy got request", JSON.stringify(body));

    // Basic validation (required fields for /chat/completions)
    if (
      !body ||
      typeof body !== "object" ||
      !body.model ||
      !Array.isArray(body.messages)
    ) {
      res.status(400).json({ error: "Invalid request - missing model/messages." });
      return;
    }

    const openaiRes = await _fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );
    const text = await openaiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      // Rare OpenAI edge: responds with raw body
      data = { raw: text };
    }
    if (!openaiRes.ok) {
      console.error("OpenAI Error", openaiRes.status, data);
    }
    res.status(openaiRes.status).json(data);
  } catch (error: any) {
    // Log all errors for diagnosis
    console.error("UNCAUGHT PROXY ERROR", error);
    res.status(500).json({ error: (error && error.message) || "Proxy error" });
  }
}