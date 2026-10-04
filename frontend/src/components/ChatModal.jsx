import { useState, useEffect, useRef } from "react";
import { IoClose, IoSend } from "react-icons/io5";
import "../styles/Modals.css";

function ChatModal({ uploader, onClose, currentUser }) {
  const uploaderId = uploader?._id || uploader?.id || uploader?.name || "uploader";
  const currentUserId = currentUser?._id || currentUser?.id || "guest";
  const storageKey = `chat_${currentUserId}_${uploaderId}`;

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: "initial-1",
        sender: "uploader",
        text: `Hi there! 👋 Thanks for checking out my shared resources. Feel free to ask any questions or request study materials!`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newMessages));
    } catch (e) {
      console.error("Failed to save chat:", e);
    }
  };

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, userMsg];
    saveMessages(updated);
    setInputText("");

    // Simulate uploader response after delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Thanks for reaching out! I've noted your question and will share more materials soon. Happy learning! 😊",
        "Glad this resource is helpful! Let me know if you need explanations on any specific topic.",
        "I'll upload the extended version with practice questions later this week. Stay tuned!",
        "Feel free to check my other shared notes in the profile section as well!",
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];

      const uploaderReply = {
        id: (Date.now() + 1).toString(),
        sender: "uploader",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      saveMessages([...updated, uploaderReply]);
    }, 1200);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="chat-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="chat-modal-header">
          <div className="chat-header-user">
            <div className="chat-avatar-wrapper">
              {uploader?.profile_image ? (
                <img
                  src={uploader.profile_image}
                  alt={uploader.name}
                  className="chat-avatar"
                />
              ) : (
                <div className="chat-avatar-initials">
                  {getInitials(uploader?.name)}
                </div>
              )}
              <span className="online-dot" title="Active now"></span>
            </div>

            <div className="chat-user-details">
              <h3>{uploader?.name || "Uploader"}</h3>
              <span className="chat-user-status">Active now</span>
            </div>
          </div>

          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
            <IoClose />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.sender === "user" ? "sent" : "received"}`}
            >
              {msg.text}
              <span className="chat-bubble-time">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="chat-typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="chat-quick-suggestions">
          <button
            type="button"
            className="chat-suggestion-chip"
            onClick={() => sendMessage("Can you share more notes on this topic?")}
          >
            📚 More notes?
          </button>
          <button
            type="button"
            className="chat-suggestion-chip"
            onClick={() => sendMessage("Is this updated for the latest syllabus?")}
          >
            ⚡ Latest syllabus?
          </button>
          <button
            type="button"
            className="chat-suggestion-chip"
            onClick={() => sendMessage("Thank you for sharing, very helpful!")}
          >
            🙌 Thanks for sharing!
          </button>
        </div>

        {/* Input */}
        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder={`Message ${uploader?.name || "uploader"}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!inputText.trim()}
            aria-label="Send message"
          >
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;
