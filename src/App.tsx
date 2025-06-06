import React from 'react';
import './App.css';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><circle cx="150" cy="150" r="140" fill="%23ccc"/><ellipse cx="150" cy="180" rx="80" ry="100" fill="%23eee"/><ellipse cx="150" cy="140" rx="55" ry="60" fill="%23ddd"/><circle cx="120" cy="130" r="15" fill="%23bbb"/><circle cx="180" cy="130" r="15" fill="%23bbb"/><ellipse cx="150" cy="200" rx="30" ry="15" fill="%23bbb"/></svg>';

function App() {
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchRandomFace = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://randomuser.me/api/?inc=picture');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const url = data?.results?.[0]?.picture?.large;
      if (url) {
        setImageUrl(url);
        setLoading(false);
        return;
      }
      throw new Error('No image URL');
    } catch (err) {
      // Retry once
      try {
        const response = await fetch('https://randomuser.me/api/?inc=picture');
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        const url = data?.results?.[0]?.picture?.large;
        if (url) {
          setImageUrl(url);
          setLoading(false);
          return;
        }
        throw new Error('No image URL');
      } catch (finalErr) {
        setLoading(false);
        window.alert('Failed to fetch random face. Please try again later.');
      }
    }
  }, []);

  React.useEffect(() => {
    fetchRandomFace();
  }, [fetchRandomFace]);

  return (
    <div className="FaceGeneratorApp">
      <div className="FaceCard">
        <img
          src={loading || !imageUrl ? PLACEHOLDER : imageUrl}
          alt={loading ? "Loading..." : "Random face"}
          className="FaceImage"
          style={{ opacity: loading ? 0.5 : 1 }}
        />
        <button
          className="GenerateButton"
          onClick={fetchRandomFace}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Random Face"}
        </button>
      </div>
    </div>
  );
}

export default App;
