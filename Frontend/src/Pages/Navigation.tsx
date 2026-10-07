import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import CurriculumList from "../Components/Navigation_Component/List";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Navigation = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pagenavigator = useNavigate();
  const { user } = useUser();
    const userId = user?.id;
  const handleUpload = async () => {
  if (!file) {
    setError("Please select a PDF first");
    return;
  }

  if (!userId) {
    pagenavigator("/login");
    return;
  }

  setError(null);
  setUploading(true);

  const docId = uuidv4();

  try {
    /* ============================
       1️⃣ Upload PDF + Parse
    ============================ */
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docId", docId);

    const parseRes = await axios.post(
      `${import.meta.env.VITE_SERVICE_BASE_URL}/parsePDF`,
      formData
    );

    if (parseRes.data.status !== "success") {
      throw new Error("PDF parsing failed");
    }

    toast.success("PDF processed successfully");

    /* ============================
       2️⃣ Extract CORRECT data
    ============================ */
    const { curriculum } = parseRes.data;

    const topic = curriculum.topic;
    const modules = curriculum.modules;

    console.log("Topic:", topic);
    console.log("Modules:", modules);
    setFileId(docId)
    /* ============================
       3️⃣ Save Curriculum
    ============================ */
    const saveRes = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/navigation/save`,
      {
        userId,
        docId,
        topic,
        curriculum: modules
      }
    );

    if (saveRes.data.status === "success") {
      pagenavigator(
        `/module?userId=${encodeURIComponent(userId)}&docId=${encodeURIComponent(docId)}`
      );
    }
  } catch (err: any) {
    console.error("Upload Error:", err);
    setError(
      err.response?.data?.message ||
      err.response?.data?.detail ||
      "Upload failed"
    );
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-950 transition-colors">
  
  {/* ============================
      LEFT SIDEBAR – Curriculum List
  ============================ */}
  {userId && (
    <aside className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Curriculums
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your learning library
        </p>
      </div>

      {/* Curriculum List */}
      <CurriculumList userId={userId} />
    </aside>
  )}

  {/* ============================
      RIGHT PANEL – Upload Workspace
  ============================ */}
  <main className="flex-1 flex justify-center px-8 py-16">
    <div className="w-full max-w-3xl">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Mercury Navigation
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Upload your syllabus, lecture slides, or reference material.
          Mercury automatically converts it into a structured learning pathway.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-8">
        
        {/* Dropzone */}
        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center hover:border-indigo-500 transition">
          <input
            type="file"
            accept="application/pdf"
            id="pdfUpload"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <label htmlFor="pdfUpload" className="cursor-pointer block">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Drop your PDF here
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              or click to browse
            </p>

            <span className="inline-block mt-6 px-6 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition">
              Select PDF
            </span>
          </label>

          {file && (
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-8 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:bg-gray-400"
        >
          {uploading ? "Analyzing PDF…" : "Create Learning Pathway"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-100 dark:bg-red-900/30 p-4">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {fileId && (
          <div className="mt-6 rounded-lg bg-green-100 dark:bg-green-900/30 p-4">
            <p className="text-green-800 dark:text-green-300 font-medium">
              Learning pathway created successfully
            </p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Document ID: <span className="font-mono">{fileId}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  </main>
</div>

  );
};

export default Navigation;
