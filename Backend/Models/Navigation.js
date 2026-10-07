import mongoose from "mongoose";

/* ============================
   Question Schema
============================ */
const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length >= 2,
        message: "A question must have at least two options"
      }
    },
    correct_answer: {
      type: String, // "A", "B", "C", etc.
      required: true,
      uppercase: true,
      trim: true
    },
    explanation: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

/* ============================
   Test Schema
============================ */
const TestSchema = new mongoose.Schema(
  {
    instructions: {
      type: String,
      required: true
    },
    questions: {
      type: [QuestionSchema],
      required: true
    }
  },
  { _id: false }
);

/* ============================
   Module Schema
============================ */
const ModuleSchema = new mongoose.Schema(
  {
    module_number: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    coverage_source_text_range: {
      type: String,
      required: true
    },
    test: {
      type: TestSchema,
      required: true
    }
  },
  { _id: false }
);

/* ============================
   Navigation / Curriculum Schema
============================ */
const NavigationSchema = new mongoose.Schema(
  {
    userId:{
        type:String,
        require:true
    },
    docId: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    curriculum: {
      type: [ModuleSchema],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Navigation", NavigationSchema);
