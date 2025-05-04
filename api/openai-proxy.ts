import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Don't log/echo key to clients!
  const apiKey = "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";

  try {
    // Vercel sometimes passes req.body as a string—parse if needed
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        res.status(400).json({ error: "Invalid JSON in body." });
        return;
      }
    }

    const openaiResponse = await fetch(
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
    const data = await openaiResponse.json();
    res.status(openaiResponse.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: (error && error.message) || "Proxy error" });
  }
}