import { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import CreateNotebookForm from "../Components/CreateNotebookForm";
import ChatPanel from "../Components/ChatPanel";
import rawHtml2pdf from "html2pdf.js";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  text: string;
}

interface Notebook {
  id: string;
  title: string;
  updated: string;
  messages: Message[];
  report?: string;
}

const Notebooks = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [selectedNotebook, setSelectedNotebook] =
    useState<Notebook | null>(null);

  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pdfRef = useRef<HTMLDivElement | null>(null);

  // Load notebooks
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/notebook/get/${userId}`
        );

        const mapped: Notebook[] = res.data.notebooks.map((nb: any) => ({
          id: nb._id,
          title: nb.name,
          updated: new Date(nb.updatedAt || nb.createdAt).toLocaleString(),
          messages: nb.chats || [],
          report:
            nb.report?.sections
              ?.map((s: any) => `## ${s.title}\n${s.content}`)
              .join("\n\n") || undefined
        }));

        setNotebooks(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch notebooks");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  // Handle notebook created
  const handleCreateNotebook = (data: any) => {
    const nb: Notebook = {
      id: data.id,
      title: data.name,
      updated: "Just Now",
      messages: [],
      report: data.report
    };

    setNotebooks(prev => [nb, ...prev]);
    setSelectedNotebook(nb);
  };

  // Chat logic
  const chatWithNotebook = async (question: string) => {
    if (!selectedNotebook) return "No notebook selected.";

    try {
      console.log(selectedNotebook)
      const res = await axios.post(
        `${import.meta.env.VITE_SERVICE_BASE_URL}/ask`,
        {
          question,
          topic: selectedNotebook.title,
          depth: "In_depth"
        }
      );

      return res.data?.answer || "No answer received.";
    } catch (err) {
      console.error(err);
      return "Failed to fetch answer.";
    }
  };

  const handleSend = async (input: string) => {
    if (!selectedNotebook) return;

    const userMsg: Message = { role: "user", text: input };

    setSelectedNotebook(prev =>
      prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev
    );

    const thinking: Message = { role: "assistant", text: "Thinking..." };
    setSelectedNotebook(prev =>
      prev ? { ...prev, messages: [...prev.messages, thinking] } : prev
    );

    const answer = await chatWithNotebook(input);

    setSelectedNotebook(prev => {
      if (!prev) return prev;

      const msgs = [...prev.messages];
      msgs.pop();
      msgs.push({ role: "assistant", text: answer });

      return { ...prev, messages: msgs };
    });
  };

  // Download PDF
const html2pdf: any = (rawHtml2pdf as any)?.default || rawHtml2pdf;

const handleDownloadPDF = () => {
  try {
    const element = pdfRef.current;

    if (!element || !selectedNotebook?.report) {
      console.error("PDF Element not found");
      return;
    }

    const options = {
      margin: 10,
      filename: `${selectedNotebook.title.replace(/\s+/g, "_")}_report.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf(element, options);
  } catch (err) {
    console.error("PDF Download Failed:", err);
  }
};


  return (
    <>
      {showForm && (
        <CreateNotebookForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateNotebook}
        />
      )}

      <div className="h-screen bg-slate-950 text-white flex overflow-hidden">

        {/* LEFT PANEL */}
        <aside className="w-72 border-r border-white/10 p-5 bg-slate-900/40 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Notebooks</h2>

          <button
            onClick={() => setShowForm(true)}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            + Create Notebook
          </button>

          {loading && <p className="mt-4 text-gray-400">Loading…</p>}
          {error && <p className="mt-4 text-red-400">{error}</p>}

          <div className="mt-5 space-y-3 overflow-y-auto">
            {notebooks.map(nb => (
              <button
                key={nb.id}
                onClick={() => setSelectedNotebook(nb)}
                className={`w-full text-left p-3 rounded-xl border ${
                  selectedNotebook?.id === nb.id
                    ? "border-indigo-500 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <p className="font-semibold">{nb.title}</p>
                <p className="text-gray-400 text-sm">{nb.updated}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER REPORT PANEL */}
        <section className="flex-2 border-r border-white/10 flex flex-col h-full overflow-hidden">
          {!selectedNotebook ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">Select a Notebook</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="border-b border-white/10 p-4 flex justify-between shrink-0">
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedNotebook.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Last updated: {selectedNotebook.updated}
                  </p>
                </div>

                {selectedNotebook.report && (
                  <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700"
                  >
                    Download PDF
                  </button>
                )}
              </div>

              {/* Scrollable report */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedNotebook.report ? (
                  <div
  ref={pdfRef}
  id="pdf-content"
  className="prose prose-invert wrap-break-words max-w-none bg-white/5 p-6 rounded-xl border border-white/10"
>

                    <ReactMarkdown>{selectedNotebook.report}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-400">No report yet.</p>
                )}
              </div>
            </>
          )}
        </section>

        {/* CHAT PANEL */}
        {selectedNotebook && (
          <ChatPanel
            notebookTitle={selectedNotebook.title}
            messages={selectedNotebook.messages}
            onSend={handleSend}
          />
        )}

      </div>
    </>
  );
};

export default Notebooks;
