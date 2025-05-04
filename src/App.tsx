import React, { useState } from "react";
import "./App.css";

// ---- Constants for categories ----
const CATEGORY_LIST = [
  { key: "pictures", label: "Pictures" },
  { key: "poems", label: "Poems" },
  { key: "jokes", label: "Jokes" },
  { key: "lyrics", label: "Song Lyrics" },
  { key: "news", label: "News Headlines" },
  { key: "stories", label: "Short Stories" },
];

// ---- Utility for category titles ----
const CATEGORY_TITLES: Record<string, string> = {
  pictures: "Which photo is real?",
  poems: "Which poem is human-written?",
  jokes: "Which joke is human-written?",
  lyrics: "Which song lyric is human-written?",
  news: "Which news headline is real?",
  stories: "Which story is human-written?",
};

// ---- Placeholder real data: replace with your own for max accuracy ----
const REAL_EXAMPLES = {
  pictures: [
    // Each entry: { url: "..." } (real, copyright-free image URLs)
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
    { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" },
  ],
  poems: [
    "I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host, of golden daffodils;",
    "Hope is the thing with feathers\nThat perches in the soul,\nAnd sings the tune without the words,\nAnd never stops at all,"
  ],
  jokes: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the bicycle fall over? Because it was two-tired!"
  ],
  lyrics: [
    "Imagine all the people living life in peace. You may say I'm a dreamer, but I'm not the only one.",
    "We will, we will rock you! Buddy, you're a boy, make a big noise, playin' in the street, gonna be a big man someday!"
  ],
  news: [
    "NASA's Perseverance Rover Successfully Lands on Mars After Seven-Month Journey",
    "World Health Organization Declares End to COVID-19 Global Health Emergency"
  ],
  stories: [
    "The old clock ticked quietly in the hallway. Emma tiptoed past, clutching the letter she never meant to send.",
    "It was raining again, the streets shining neon red and blue. Detective Harris found her clue in the puddle."
  ]
};

// ---- OpenAI API Call Utility ----
const OPENAI_REQUEST_COOLDOWN = 20; // seconds

let lastOpenAIRequest = 0;
const getNow = () => Math.floor(Date.now() / 1000);

const callOpenAI = async (prompt: string): Promise<string> => {
  // Log every request for debug
  if (typeof window !== "undefined" && window.console) {
    console.log('[callOpenAI] Called at', new Date().toISOString(), 'Prompt:', prompt.slice(0, 120));
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("/api/openai-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
        temperature: 0.8
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (response.status === 429) {
      return "__OPENAI_RATELIMIT__";
    }
    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${txt}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (e: any) {
    return "__OPENAI_ERROR__";
  }
};

// ---- Utility for randomizing left/right placement ----
function shufflePair<T>(arr: [T, T]): [T, T] {
  return Math.random() < 0.5 ? arr : [arr[1], arr[0]];
}

// ---- Category Game Components ----

type CategoryGameProps = {
  addPoint: () => void;
  subPoint: () => void;
};

// Improved: useLevelState triggers updates and shuffling correctly per round
function useLevelState<T>(
  reals: T[],
  aiPromptBuilder: (real: T) => string,
  formatter: (aiRaw: string) => T
) {
  const [levelKey, setLevelKey] = useState(0);
  const [realIdx, setRealIdx] = useState(() => Math.floor(Math.random() * reals.length));
  const [aiItem, setAiItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextLevel = () => setLevelKey(k => k + 1);

  React.useEffect(() => {
    let cancelled = false;
    async function loadLevel() {
      setLoading(true);
      setError(null);
      const idx = Math.floor(Math.random() * reals.length);
      setRealIdx(idx);
      try {
        const aiPrompt = aiPromptBuilder(reals[idx]);
        const aiRaw = await callOpenAI(aiPrompt);
        if (!cancelled) {
          if (aiRaw === "__OPENAI_COOLDOWN__") {
            setError("You must wait at least 20 seconds between rounds to stay within OpenAI rate limits. Please wait and try again.");
            setAiItem(null);
          } else if (aiRaw === "__OPENAI_RATELIMIT__") {
            setError("Rate limited by OpenAI. Please slow down, wait a minute, and try again.");
            setAiItem(null);
          } else if (aiRaw === "__OPENAI_ERROR__") {
            setError("AI couldn't generate content. Check your connection or try again.");
          } else {
            setAiItem(formatter(aiRaw));
            setError(null);
          }
        }
      } catch (e: any) {
        if (!cancelled) setError("AI failed to generate content.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadLevel();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [levelKey]);

  // Returns: real, ai, loading, nextLevel, error
  return {
    real: reals[realIdx],
    ai: aiItem,
    loading,
    error,
    nextLevel
  };
}

// ---- Pictures Game ----
// Now the AI side displays a GPT-generated description, not an image
function PicturesGame({ addPoint, subPoint }: CategoryGameProps) {
  const realImages = REAL_EXAMPLES.pictures;
  const aiPromptBuilder = (real: { url: string }) =>
    `Write an imaginative, detailed photo description for an image that could be completely artificial (AI generated). Describe the subject, setting, mood, color and style but DO NOT literally copy or refer to the provided URL. Just return the description, nothing else.`;

  // For real entries we show the photo; for "AI" we show description
  const formatter = (desc: string) => desc.trim();

  // Get just the real photo
  const [realIdx, setRealIdx] = useState(() => Math.floor(Math.random() * REAL_EXAMPLES.pictures.length));
  const real = REAL_EXAMPLES.pictures[realIdx];

  // For AI, fetch the description each round
  const [aiDescription, setAIDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextLevel = React.useCallback(() => {
    setLoading(true);
    setError(null);
    const idx = Math.floor(Math.random() * REAL_EXAMPLES.pictures.length);
    setRealIdx(idx);
    const prompt = aiPromptBuilder(REAL_EXAMPLES.pictures[idx]);
    callOpenAI(prompt)
      .then(raw => {
        if (raw === "__OPENAI_COOLDOWN__") {
          setAIDescription(null);
          setError(
            `You must wait at least 20 seconds between rounds to stay within OpenAI rate limits. Please wait and try again.`
          );
        } else if (raw === "__OPENAI_RATELIMIT__") {
          setAIDescription(null);
          setError("Rate limit reached. Please wait a minute and try again, or reduce how quickly you play.");
        } else if (raw === "__OPENAI_ERROR__") {
          setAIDescription(null);
          setError("AI couldn't generate a description. Try again.");
        } else {
          setAIDescription(formatter(raw));
          setError(null);
        }
      })
      .catch(() => {
        setAIDescription(null);
        setError("AI failed to generate a description.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // On mount and when nextLevel called, load new round
  React.useEffect(() => { nextLevel(); }, []); // eslint-disable-line

  // Shuffle "real" and "AI desc" on every round
  const [shuffled, setShuffled] = useState<Array<{ kind: "real", url: string } | { kind: "ai", description: string }> | null>(null);
  React.useEffect(() => {
    if (!loading && real && aiDescription) {
      const pair = Math.random() < 0.5
        ? [{ kind: "real" as const, url: real.url }, { kind: "ai" as const, description: aiDescription }]
        : [{ kind: "ai" as const, description: aiDescription }, { kind: "real" as const, url: real.url }];
      setShuffled(pair);
    } else {
      setShuffled(null);
    }
  }, [loading, real, aiDescription]);

  const handleSelect = (chosen: { kind: string }) => {
    if (loading || !shuffled) return;
    if (chosen.kind === "real") addPoint();
    else subPoint();
    setShuffled(null);
    nextLevel();
  };

  return (
    <div>
      <h2>{CATEGORY_TITLES.pictures}</h2>
      {error ? (
        <div>
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          <button onClick={nextLevel}>Try Again</button>
        </div>
      ) : loading || !shuffled ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: 32 }}>
          {shuffled.map((item, i) =>
            <div
              key={i}
              style={{ cursor: "pointer", border: "2px solid #ccc", borderRadius: 8, overflow: "hidden", minWidth: 320, minHeight: 220, background: "#fff" }}
              onClick={() => handleSelect(item)}
            >
              {item.kind === "real" ? (
                <>
                  <img src={item.url} alt="Real" style={{ width: 300, height: 200, objectFit: 'cover', display: "block" }} />
                  <div style={{ textAlign: "center", padding: 8 }}>Photo {i + 1}</div>
                </>
              ) : (
                <>
                  <div style={{ padding: 16, minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <span><b>AI Generated Description:</b><br />"{item.description}"</span>
                  </div>
                  <div style={{ textAlign: "center", padding: 8 }}>Photo {i + 1}</div>
                </>
              )}
            </div>
          )}
        </div>
      )}
      <div>Identify which is the real photograph and which is just an AI-generated description!</div>
    </div>
  );
}

// ---- Poems Game ----
function PoemsGame({ addPoint, subPoint }: CategoryGameProps) {
  const realPoems = REAL_EXAMPLES.poems;
  const aiPromptBuilder = (real: string) =>
    `Write an original, short poem that is in a similar style and length to this human-made poem:\n\n"${real}"\n\nDo NOT copy content or mention AI. Return ONLY your poem.`;
  const formatter = (raw: string) => raw.trim();

  const { real, ai, loading, error, nextLevel } = useLevelState<string>(
    realPoems,
    aiPromptBuilder,
    formatter
  );

  const [shuffled, setShuffled] = useState<[string, string] | null>(null);
  React.useEffect(() => {
    if (real && ai) setShuffled(shufflePair([real, ai]));
    // eslint-disable-next-line
  }, [real, ai]);

  const handleSelect = (chosen: string) => {
    if (loading || !shuffled) return;
    if (chosen === real) addPoint();
    else subPoint();
    nextLevel();
    setShuffled(null);
  };

  return (
    <div>
      <h2>{CATEGORY_TITLES.poems}</h2>
      {error ? (
        <div>
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          <button onClick={nextLevel}>Try Again</button>
        </div>
      ) : loading || !shuffled ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: 32 }}>
          {shuffled.map((poem, i) =>
            <div key={i}
              style={{ cursor: "pointer", border: "2px solid #ccc", borderRadius: 8, minWidth: 300, minHeight: 120, padding: 16 }}
              onClick={() => handleSelect(poem)}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{poem}</pre>
              <div style={{ textAlign: "center", marginTop: 8 }}>Poem {i + 1}</div>
            </div>
          )}
        </div>
      )}
      <div>Choose which poem was written by a human.</div>
    </div>
  );
}

// ---- Jokes Game ----
function JokesGame({ addPoint, subPoint }: CategoryGameProps) {
  const realJokes = REAL_EXAMPLES.jokes;
  const aiPromptBuilder = (real: string) =>
    `Create a brand new joke, in a similar style and length to this one, that could have been written by a human:\n\n"${real}"\n\nReturn ONLY your joke.`;
  const formatter = (raw: string) => raw.trim();

  const { real, ai, loading, error, nextLevel } = useLevelState<string>(
    realJokes,
    aiPromptBuilder,
    formatter
  );

  const [shuffled, setShuffled] = useState<[string, string] | null>(null);
  React.useEffect(() => {
    if (real && ai) setShuffled(shufflePair([real, ai]));
    // eslint-disable-next-line
  }, [real, ai]);

  const handleSelect = (chosen: string) => {
    if (loading || !shuffled) return;
    if (chosen === real) addPoint();
    else subPoint();
    nextLevel();
    setShuffled(null);
  };

  return (
    <div>
      <h2>{CATEGORY_TITLES.jokes}</h2>
      {error ? (
        <div>
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          <button onClick={nextLevel}>Try Again</button>
        </div>
      ) : loading || !shuffled ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: 32 }}>
          {shuffled.map((joke, i) =>
            <div key={i}
              style={{ cursor: "pointer", border: "2px solid #ccc", borderRadius: 8, minWidth: 280, minHeight: 80, padding: 16 }}
              onClick={() => handleSelect(joke)}>
              <div>{joke}</div>
              <div style={{ textAlign: "center", marginTop: 8 }}>Joke {i + 1}</div>
            </div>
          )}
        </div>
      )}
      <div>Pick the human-written joke.</div>
    </div>
  );
}

// ---- Song Lyrics Game ----
function LyricsGame({ addPoint, subPoint }: CategoryGameProps) {
  const realLyrics = REAL_EXAMPLES.lyrics;
  const aiPromptBuilder = (real: string) =>
    `Write a short original song lyric in the same style as this real lyric, but on a new topic:\n\n"${real}"\n\nDo NOT copy content or reference AI. Only return the lyric.`;
  const formatter = (raw: string) => raw.trim();

  const { real, ai, loading, error, nextLevel } = useLevelState<string>(
    realLyrics,
    aiPromptBuilder,
    formatter
  );

  const [shuffled, setShuffled] = useState<[string, string] | null>(null);
  React.useEffect(() => {
    if (real && ai) setShuffled(shufflePair([real, ai]));
    // eslint-disable-next-line
  }, [real, ai]);

  const handleSelect = (chosen: string) => {
    if (loading || !shuffled) return;
    if (chosen === real) addPoint();
    else subPoint();
    nextLevel();
    setShuffled(null);
  };

  return (
    <div>
      <h2>{CATEGORY_TITLES.lyrics}</h2>
      {error ? (
        <div>
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          <button onClick={nextLevel}>Try Again</button>
        </div>
      ) : loading || !shuffled ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: 32 }}>
          {shuffled.map((lyric, i) =>
            <div key={i}
              style={{ cursor: "pointer", border: "2px solid #ccc", borderRadius: 8, minWidth: 280, minHeight: 90, padding: 16 }}
              onClick={() => handleSelect(lyric)}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{lyric}</pre>
              <div style={{ textAlign: "center", marginTop: 8 }}>Lyric {i + 1}</div>
            </div>
          )}
        </div>
      )}
      <div>Can you spot the human lyricist?</div>
    </div>
  );
}

// ---- News Headlines Game ----
function NewsGame({ addPoint, subPoint }: CategoryGameProps) {
  const realHeadlines = REAL_EXAMPLES.news;
  const aiPromptBuilder = (real: string) =>
    `Write a fake but plausible news headline, not real, in the same style/length as this real news headline:\n\n"${real}"\n\nDo NOT reference AI. Only the headline.`;
  const formatter = (raw: string) => raw.split('\n')[0].trim();

  const { real, ai, loading, error, nextLevel } = useLevelState<string>(
    realHeadlines,
    aiPromptBuilder,
    formatter
  );

  const [shuffled, setShuffled] = useState<[string, string] | null>(null);
  React.useEffect(() => {
    if (real && ai) setShuffled(shufflePair([real, ai]));
    // eslint-disable-next-line
  }, [real, ai]);

  const handleSelect = (chosen: string) => {
    if (loading || !shuffled) return;
    if (chosen === real) addPoint();
    else subPoint();
    nextLevel();
    setShuffled(null);
  };

  return (
    <div>
      <h2>{CATEGORY_TITLES.news}</h2>
      {error ? (
        <div>
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          <button onClick={nextLevel}>Try Again</button>
        </div>
      ) : loading || !shuffled ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: 32 }}>
          {shuffled.map((headline, i) =>
            <div key={i}
              style={{ cursor: "pointer", border: "2px solid #ccc", borderRadius: 8, minWidth: 300, minHeight: 60, padding: 16 }}
              onClick={() => handleSelect(headline)}>
              <div>{headline}</div>
              <div style={{ textAlign: "center", marginTop: 8 }}>Headline {i + 1}</div>
            </div>
          )}
        </div>
      )}
      <div>Which headline is real?</div>
    </div>
  );
}

// ---- Short Stories Game ----
function StoriesGame({ addPoint, subPoint }: CategoryGameProps) {
  const realStories = REAL_EXAMPLES.stories;
  const aiPromptBuilder = (real: string) =>
    `Write a very short story of the same style and length as this human-written story:\n\n"${real}"\n\nDo NOT reference AI, and do not copy the story. Only return the story.`;
  const formatter = (raw: string) => raw.trim();

  const { real, ai, loading, error, nextLevel } = useLevelState<string>(
    realStories,
    aiPromptBuilder,
    formatter
  );

  const [shuffled, setShuffled] = useState<[string, string] | null>(null);
  React.useEffect(() => {
    if (real && ai) setShuffled(shufflePair([real, ai]));
    // eslint-disable-next-line
  }, [real, ai]);

  const handleSelect = (chosen: string) => {
    if (loading || !shuffled) return;
    if (chosen === real) addPoint();
    else subPoint();
    nextLevel();
    setShuffled(null);
  };

  return (
    <div>
      <h2>{CATEGORY_TITLES.stories}</h2>
      {error ? (
        <div>
          <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
          <button onClick={nextLevel}>Try Again</button>
        </div>
      ) : loading || !shuffled ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: 32 }}>
          {shuffled.map((story, i) =>
            <div key={i}
              style={{ cursor: "pointer", border: "2px solid #ccc", borderRadius: 8, minWidth: 340, minHeight: 100, padding: 16 }}
              onClick={() => handleSelect(story)}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{story}</pre>
              <div style={{ textAlign: "center", marginTop: 8 }}>Story {i + 1}</div>
            </div>
          )}
        </div>
      )}
      <div>Pick out the human storyteller.</div>
    </div>
  );
}

// ---- Main App Component ----

function App() {
  const [category, setCategory] = useState<string | null>(null);
  const [points, setPoints] = useState(0);

  const addPoint = () => setPoints(pt => pt + 1);
  const subPoint = () => setPoints(pt => pt - 1);

  const startOver = () => {
    setCategory(null);
    setPoints(0);
  };

  return (
    <div className="App">
      <header style={{ padding: "18px 0", background: "#232346", color: "white", fontSize: 28, textAlign: "center" }}>
        AI Detection Challenge
      </header>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 32px", background: "#f5f6fa" }}>
        <div>
          {CATEGORY_LIST.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              style={{
                margin: "0 8px",
                padding: "8px 20px",
                borderRadius: 20,
                border: category === key ? "2px solid #232346" : "1px solid #bbb",
                background: category === key ? "#232346" : "#fff",
                color: category === key ? "white" : "#232346",
                fontWeight: "bold",
                cursor: "pointer"
              }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 20 }}>
          Total Points: <span style={{ color: "#1976d2", fontWeight: 600 }}>{points}</span>
          <button
            onClick={startOver}
            style={{ marginLeft: 18, padding: "4px 12px", fontSize: 12, borderRadius: 14, border: "1px solid #bbb", cursor: "pointer" }}
          >Restart</button>
        </div>
      </div>
      <main style={{ minHeight: 500, padding: 24 }}>
        {!category && (
          <div style={{ textAlign: "center", fontSize: 22, marginTop: 80 }}>
            <p>Welcome to the AI Detection Challenge!<br />Select a category above to test your detection skills across six fun mediums.</p>
            <p>Gain points by correctly guessing the real/human item, lose points for mistakes.<br />Play as long as you like—see how high a score you can get!</p>
          </div>
        )}
        {category === "pictures" && <PicturesGame addPoint={addPoint} subPoint={subPoint} />}
        {category === "poems" && <PoemsGame addPoint={addPoint} subPoint={subPoint} />}
        {category === "jokes" && <JokesGame addPoint={addPoint} subPoint={subPoint} />}
        {category === "lyrics" && <LyricsGame addPoint={addPoint} subPoint={subPoint} />}
        {category === "news" && <NewsGame addPoint={addPoint} subPoint={subPoint} />}
        {category === "stories" && <StoriesGame addPoint={addPoint} subPoint={subPoint} />}
      </main>
      <footer style={{ padding: 16, background: "#eee", textAlign: "center", color: "#334", fontSize: 14 }}>
        &copy; {new Date().getFullYear()} AI Detection Challenge
      </footer>
    </div>
  );
}

export default App;
