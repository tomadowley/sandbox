import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support speech synthesis.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Speech Generator</h1>
        <textarea
          rows={4}
          cols={40}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text to speak..."
          style={{ marginBottom: 16, fontSize: 16, padding: 8 }}
        />
        <br />
        <button onClick={handleSpeak} disabled={!text || speaking} style={{ fontSize: 18, padding: '8px 24px' }}>
          {speaking ? 'Speaking...' : 'Speak'}
        </button>
      </header>
    </div>
  );
}

export default App;
