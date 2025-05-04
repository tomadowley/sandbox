const fetch = require('node-fetch');

module.exports = async (req, res) => {
  console.log("API Proxy invoked", req.method, Date.now());

  if (req.method === "GET") {
    res.status(200).json({ pong: true, server: true, ts: Date.now() });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  
  const apiKey = "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";
  
  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {
        res.status(400).json({ error: "Invalid JSON in body." }); return;
      }
    }
    console.log("Proxying to OpenAI with model:", body && body.model);
    // Sanity check for required fields
    if (!body || typeof body !== "object" || !body.model || !Array.isArray(body.messages)) {
      res.status(400).json({ error: "Invalid request - missing model/messages." }); return;
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }
    if (!response.ok) {
      console.error("OpenAI service error:", response.status, json);
    }
    res.status(response.status).json(json);
  } catch (err) {
    console.error("Fatal proxy error", err && err.message, err);
    res.status(500).json({ error: 'Proxy error: ' + (err && err.message || 'unknown') });
  }
};