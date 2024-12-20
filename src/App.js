import React, { useState } from "react";
import axios from "axios";
import "./App.css";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const App = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newChat = [...chat, { sender: "user", text: input }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const reply = response?.data?.candidates?.[0]?.content?.parts?.[0].text || "No response";
      setChat([...newChat, { sender: "bot", text: reply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChat([...newChat, { sender: "bot", text: "Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-header">Gemini Chat</div>
      <div className="chat-container">
        {chat.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        {loading && <div className="loading-message">Loading...</div>}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
