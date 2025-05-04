const fetch = require('node-fetch');

// Very simplistic in-memory IP rate limit (reset per function cold start!)
// In production use a durable store or Redis.
let ipCallHistory = {};

module.exports = async (req, res) => {
  const now = Date.now();
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.connection?.remoteAddress ||
    "unknown";

  // Track all POST request invocations for diagnosis:
  if (!ipCallHistory[ip]) ipCallHistory[ip] = [];
  ipCallHistory[ip].push(now);

  // Clean up history >10min old (in-memory only)
  ipCallHistory[ip] = ipCallHistory[ip].filter(
    t => now - t < 10 * 60 * 1000
  );

  console.log(
    `[AI Proxy] ${req.method} from IP ${ip}, count in last 10min: ${ipCallHistory[ip].length
    }, now=${now}, body=${JSON.stringify(req.body).slice(0, 300)}`
  );

  if (ipCallHistory[ip].length > 20) {
    res.status(429).json({
      error: "per_ip_rate_limited",
      message:
        "Too many requests from this IP in last 10 minutes. Please slow down or wait."
    });
    return;
  }

  if (req.method === "GET") {
    res.status(200).json({ pong: true, server: true, ts: now, yourIP: ip });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "OPENAI_API_KEY is not set. Please set as env in Vercel project settings." });
    return;
  }
  
  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {
        res.status(400).json({ error: "Invalid JSON in body." }); return;
      }
    }
    console.log("Proxying to OpenAI start:", { model: body && body.model, time: now, prompt: (body && body.messages && body.messages[0] && body.messages[0].content || '').slice(0, 160) });
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
      if (response.status === 429) {
        console.error("[AI Proxy] OpenAI rate limit hit (429).", json);
        res.status(429).json({ error: 'rate_limited', message: (json && json.error && json.error.message) || 'Too many requests – please slow down and try again.' });
        return;
      }
      console.error("[AI Proxy] OpenAI service error:", response.status, json);
    }
    res.status(response.status).json(json);
  } catch (err) {
    console.error("[AI Proxy] Fatal proxy error", err && err.message, err);
    res.status(500).json({ error: 'Proxy error: ' + (err && err.message || 'unknown') });
  }
};