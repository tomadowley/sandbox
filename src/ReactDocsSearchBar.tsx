import React, { useState, useRef } from "react";

// Algolia DocSearch API for React docs: https://react.dev/search
const ALGOLIA_SEARCH_URL =
  "https://BH4D9OD16A-dsn.algolia.net/1/indexes/*/queries";
const ALGOLIA_HEADERS = {
  "Content-Type": "application/json",
  "X-Algolia-API-Key": "9e2c4a0fb84a4a2b2e9d5b2a3b6b6c2e",
  "X-Algolia-Application-Id": "BH4D9OD16A",
};

type SearchHit = {
  url: string;
  hierarchy: {
    lvl0?: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
  };
  _highlightResult?: any;
};

export default function ReactDocsSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (search: string) => {
    if (!search.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setLoading(true);
    const body = {
      requests: [
        {
          indexName: "react",
          params: `query=${encodeURIComponent(search)}&hitsPerPage=8`,
        },
      ],
    };
    try {
      const response = await fetch(ALGOLIA_SEARCH_URL, {
        method: "POST",
        headers: ALGOLIA_HEADERS,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setResults(data.results?.[0]?.hits ?? []);
      setShowResults(true);
    } catch (e) {
      setResults([]);
      setShowResults(false);
    }
    setLoading(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const onBlur = () => setTimeout(() => setShowResults(false), 200);
  const onFocus = () => {
    if (results.length > 0) setShowResults(true);
  };

  return (
    <div style={{ position: "relative", maxWidth: 400, margin: "1rem auto" }}>
      <input
        type="search"
        placeholder="Search React docs..."
        value={query}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />
      {loading && (
        <div style={{ position: "absolute", right: 10, top: 10, fontSize: 12 }}>
          Loading...
        </div>
      )}
      {showResults && results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "2.5rem",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 4,
            maxHeight: 300,
            overflowY: "auto",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          {results.map((hit, i) => (
            <li key={hit.url + i}>
              <a
                href={hit.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  color: "#2a2a2a",
                  textDecoration: "none",
                  borderBottom: i < results.length - 1 ? "1px solid #eee" : "",
                }}
                onMouseDown={e => e.preventDefault()}
              >
                <div style={{ fontWeight: 600 }}>
                  {hit.hierarchy.lvl1 || hit.hierarchy.lvl0}
                </div>
                <div style={{ fontSize: 13, color: "#888" }}>
                  {[
                    hit.hierarchy.lvl2,
                    hit.hierarchy.lvl3,
                    hit.hierarchy.lvl4,
                  ]
                    .filter(Boolean)
                    .join(" › ")}
                </div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{hit.url}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}