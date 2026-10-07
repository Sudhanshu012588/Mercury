import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

const ReportSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { _id: false }
);

const NotebookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // IMPORTANT FIX
    userId: {
      type: String,
      required: true
    },

    report: {
      sections: [ReportSectionSchema]
    },

    chats: [ChatSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Notebook", NotebookSchema);
