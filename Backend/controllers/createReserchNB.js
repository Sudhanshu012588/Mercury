import Notebook from "../Models/NoteBook.js";   // adjust path
import mongoose from "mongoose";

export const createNB = async (req, res) => {
  try {
    const { NoteBookName, userId } = req.body;

    if (!NoteBookName || !userId) {
    
      return res.status(400).json({
        status: "failed",
        message: "Please provide NoteBookName and userId"
      });
    }

    

    const newNotebook = await Notebook.create({
      name: NoteBookName,
      userId,
      report: {
        sections: []     // default empty dropdown sections
      },
      chats: []
    });

    return res.status(201).json({
      status: "success",
      message: "Notebook created successfully",
      notebook: newNotebook
    });

  } catch (error) {
    console.error("Notebook Creation Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message
    });
  }
};


export const getUserNotebooks = async (req, res) => {
  try {
    const { userId } = req.params;   // coming from URL param

    if (!userId) {
      return res.status(400).json({
        status: "failed",
        message: "userId is required"
      });
    }

    const notebooks = await Notebook.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      count: notebooks.length,
      notebooks
    });

  } catch (error) {
    console.error("Fetch Notebook Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message
    });
  }
};
export const saveNotebookReport = async (req, res) => {
  console.log("====== SAVE NOTEBOOK REPORT HIT ======");

  try {
    console.log("🟢 Request Params:", req.params);
    console.log("🟢 Request Body:", req.body);

    const { notebookId } = req.params;
    const { sections, rawReport } = req.body;

    if (!notebookId) {
      console.log("❌ notebookId missing in params");
      return res.status(400).json({
        status: "failed",
        message: "notebookId is required"
      });
    }

    if (!sections && !rawReport) {
      console.log("❌ Report content missing");
      return res.status(400).json({
        status: "failed",
        message: "Report data is required"
      });
    }

    console.log("🔍 Searching Notebook:", notebookId);

    const notebook = await Notebook.findById(notebookId);

    if (!notebook) {
      console.log("❌ Notebook NOT found in DB");
      return res.status(404).json({
        status: "failed",
        message: "Notebook not found"
      });
    }

    console.log("✅ Notebook Found:", {
      id: notebook._id,
      name: notebook.name
    });

    console.log("✏️ Updating Notebook Report…");

    notebook.report = {
      sections: sections || [],
      rawReport: rawReport || ""
    };

    notebook.updatedAt = new Date();

    await notebook.save();

    console.log("💾 Notebook Report Saved Successfully!");

    return res.status(200).json({
      status: "success",
      message: "Report saved successfully",
      notebook
    });

  } catch (error) {
    console.error("💥 Report Save Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message
    });
  }
};
