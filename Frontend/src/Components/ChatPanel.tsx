import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  text: string;
}

interface Props {
  notebookTitle: string;
  messages: Message[];
  onSend: (input: string) => Promise<void>;
}

const ChatPanel = ({ notebookTitle, messages, onSend }: Props) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendClick = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    await onSend(msg);
  };

  return (
    <section className="flex-[1.2] flex flex-col h-screen bg-slate-900/40">

      {/* Header */}
      <div className="border-b border-white/10 p-4 shrink-0">
        <h2 className="text-xl font-semibold">
          Conversation – {notebookTitle}
        </h2>
      </div>

      {/* Scrollable Chat */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-lg p-4 rounded-xl wrap-break-words prose prose-invert prose-p:mb-2 prose-pre:bg-black/30 prose-pre:p-3 prose-pre:rounded-xl ${
              msg.role === "user"
                ? "ml-auto bg-indigo-600"
                : "bg-white/10"
            }`}
          >
            {msg.role === "assistant" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Fixed Bottom Input */}
      <div className="p-4 border-t border-white/10 bg-slate-900 sticky bottom-0 flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10"
          placeholder="Ask something..."
        />
        <button
          onClick={handleSendClick}
          className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </section>
  );
};

export default ChatPanel;
