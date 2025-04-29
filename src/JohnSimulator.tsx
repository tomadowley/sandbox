import React, { useState } from 'react';

const johnReplies = [
  "Hi! I'm John. How can I help you today?",
  "Interesting point! Tell me more.",
  "I'm just a simulator, but I try my best.",
  "Can I get back to you on that?",
  "That's a classic John question.",
  "Let me think about it... Done!",
  "That reminds me of a story, but it's too long to tell.",
  "Let's keep things simple, shall we?",
  "Have you tried turning it off and on again?",
  "That's above my paygrade!",
  "I love Nando's for lunch!"
];

export default function JohnSimulator() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{from: string, text: string}[]>([
    {from: 'John', text: "Hello, I'm John! Ask me anything."}
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { from: 'You', text: input };
    const johnMessage = { 
      from: 'John', 
      text: johnReplies[Math.floor(Math.random() * johnReplies.length)]
    };
    setMessages(prev => [...prev, userMessage, johnMessage]);
    setInput('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '2rem auto',
      padding: 20,
      border: '1px solid #ccc',
      borderRadius: 8,
      background: '#f8f8f8'
    }}>
      <h2>John Simulator</h2>
      <div style={{
        height: 200,
        overflowY: 'auto',
        marginBottom: 16,
        padding: 8,
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: 4
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.from === 'You' ? 'right' : 'left',
            margin: '4px 0'
          }}>
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input 
        type="text"
        placeholder="Say something to John..."
        value={input}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        style={{
          width: '80%',
          marginRight: 8,
          padding: '6px'
        }}
      />
      <button onClick={handleSend} style={{padding: '6px 12px'}}>Send</button>
    </div>
  );
}