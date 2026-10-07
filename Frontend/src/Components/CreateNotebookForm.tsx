import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    id: string;
    name: string;
    topic: string;
    prompt: string;
    report?: string;
  }) => void;
}

const CreateNotebookForm = ({ onClose, onSubmit }: Props) => {
  // const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [prompt, setPrompt] = useState("");

  const { user, isLoaded, isSignedIn } = useUser();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isLoaded || !isSignedIn || !user) {
    toast.error("User not signed in");
    return;
  }

  try {
    // =========================
    // 1️⃣ CREATE NOTEBOOK
    // =========================
    console.log("📘 Creating Notebook…", {
      name,
      userId: user.id,
      url: `${import.meta.env.VITE_BACKEND_BASE_URL}/notebook/create`
    });

    toast.loading("Creating notebook…", { id: "notebook" });

    let notebookId = "";

    try {
      const nbRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/notebook/create`,
        {
          NoteBookName: topic,
          userId: user.id
        }
      );

      console.log("✅ Notebook Created Response:", nbRes.data);

      if (nbRes.data.status !== "success")
        throw new Error("Notebook creation failed");

      notebookId = nbRes.data.notebook?._id;
      toast.success("Notebook Created", { id: "notebook" });
    } catch (err) {
      console.error("❌ Notebook API Failed:", err);
      toast.error("Notebook creation failed", { id: "notebook" });
      return;
    }

    // =========================
    // 2️⃣ RESEARCH API
    // =========================
    console.log("🧠 Calling Research Service…", {
      prompt,
      researchURL: `${import.meta.env.VITE_SERVICE_BASE_URL}/research`
    });

    toast.loading("Generating research report…", { id: "research" });

    let reportMarkdown = "";

    try {
      const researchRes = await axios.post(
        `${import.meta.env.VITE_SERVICE_BASE_URL}/research`,
        {
          prompt,
          depth: "deep_research"
        }
      );

      console.log("✅ Research API Response:", researchRes.data);

      reportMarkdown =
        researchRes.data?.report ||
        researchRes.data?.response ||
        researchRes.data ||
        "";

      if (!reportMarkdown) throw new Error("Empty research report received");
    } catch (err) {
      console.error("❌ Research API Failed:", err);
      toast.error("Research generation failed", { id: "research" });
      return;
    }


    console.log("💾 Saving Report to Notebook…", {
      notebookId,
      saveURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/notebook/report/${notebookId}`
    });

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/notebook/report/${notebookId}`,
        {
          sections: [
            {
              title: topic,
              content: reportMarkdown
            }
          ],
          rawReport: reportMarkdown
        }
      );

      console.log("✅ Report Saved to Notebook Successfully");
    } catch (err) {
      console.error("❌ Failed Saving Report to Notebook:", err);
      toast.error("Failed to save report to notebook");
      return;
    }

    // =========================
    // 4️⃣ SAVE REPORT IN SERVICE DB
    // =========================
    console.log("🗄️ Saving Report in Service DB…", {
      url: `${import.meta.env.VITE_SERVICE_BASE_URL}/save_report`,
      topic
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVICE_BASE_URL}/save_report`,
        {
          report: reportMarkdown,
          topic,
          depth: "In_depth"
        }
      );

      console.log("✅ Report Saved in Service DB Successfully");
    } catch (err) {
      console.error("⚠️ Failed Saving Report in Service DB:", err);
      // NOTE: Not fatal — Notebook already has report
    }

    toast.success("Report Generated & Saved", { id: "research" });

    // =========================
    // 5️⃣ UPDATE UI
    // =========================
    onSubmit({
      id: notebookId,
      name:topic,
      topic,
      prompt,
      report: reportMarkdown
    });

    onClose();
  } catch (err) {
    console.error("💥 Unexpected Fatal Error in handleSubmit:", err);
    toast.error("Failed to create notebook or generate report");
  }
};


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        className="w-122.5 bg-slate-900 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Create Notebook</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <p className="text-sm text-gray-300">Notebook Name</p>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-white mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            />
          </div> */}

          <div>
            <p className="text-sm text-gray-300">Research Topic</p>
            <input
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none text-white"
            />
          </div>

          <div>
            <p className="text-sm text-gray-300">Prompt</p>
            <textarea
              required
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="w-full text-white mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateNotebookForm;
