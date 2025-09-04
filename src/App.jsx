import { useState, useEffect, useRef } from "react";
import { Send, Mic, Globe, Sun, Moon } from "lucide-react";
import { URL } from "./constant"; // Your Gemini API URL

export default function PolyglotChatbot() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);



  const toggleTheme = () => setIsDarkMode(!isDarkMode);


  // ✅ Function to ask Gemini API
  const askQuestion = async (questionText) => {
    if (!questionText.trim()) return;

    const payload = {
      contents: [
        {
          parts: [{ text: questionText }],
        },
      ],
    };

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      response = await response.json();

      const text =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini 😢";

      // Add Gemini response to messages
      setMessages((prev) => [...prev, { text, sender: "bot" }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { text: "⚠️ Error fetching response", sender: "bot" }]);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    
    // Call Gemini API
    askQuestion(message);

    setMessage(""); // Clear input
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-10 px-4 py-3 border-b transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode ? "bg-blue-600" : "bg-blue-500"
              }`}
            >
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-xl font-semibold transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>AI Chatbot</h1>
          </div>
          <div className="flex items-center space-x-2">
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDarkMode ? "bg-blue-600" : "bg-blue-500"
              }`}>
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 shadow-sm transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900 border border-gray-200"
              }`}>
                <p className="text-sm leading-relaxed">
                  Hello! I'm Babble AI. How can I help you today?
                </p>
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 shadow-sm transition-colors duration-300 ${
                  msg.sender === "user"
                    ? isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                    : isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed Input Bar */}
      <div className={`sticky bottom-0 border-t transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className={`flex items-center space-x-3 rounded-2xl px-4 py-3 shadow-lg transition-all duration-300 ${
            isDarkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200"
          }`}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className={`flex-1 bg-transparent border-0 outline-none text-sm transition-colors duration-300 ${
                isDarkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"
              }`}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`p-2 rounded-full transition-all duration-300 ${
                message.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : isDarkMode
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
