import Navigation from "../Models/Navigation.js";
/**
 * Save Curriculum Controller
 * POST /api/navigation
 */
export const saveCurriculum = async (req, res) => {
  try {
    const { userId, docId, topic, curriculum } = req.body;

    /* ============================
       Basic Validation
    ============================ */
    if (!userId || !docId || !topic || !curriculum) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: userId, docId, topic, curriculum"
      });
    }

    if (!Array.isArray(curriculum) || curriculum.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Curriculum must be a non-empty array"
      });
    }

    /* ============================
       Duplicate Check
       (docId should be unique per user)
    ============================ */
    const existing = await Navigation.findOne({ docId, userId });

    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "Curriculum already exists for this document"
      });
    }

    /* ============================
       Save Curriculum
    ============================ */
    const navigation = await Navigation.create({
      userId,
      docId,
      topic,
      curriculum
    });

    return res.status(201).json({
      status: "success",
      message: "Curriculum saved successfully",
      data: navigation
    });
  } catch (error) {
    console.error("Save Curriculum Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to save curriculum",
      error: error.message
    });
  }
};

export const findCurriculum = async (req, res) => {
  try {
    const { userId, docId } = req.params;

    /* ============================
       Validation
    ============================ */
    if (!userId || !docId) {
      return res.status(400).json({
        status: "error",
        message: "userId and docId are required parameters"
      });
    }

    /* ============================
       Fetch Curriculum
    ============================ */
    const curriculum = await Navigation.findOne(
      { userId, docId },
      {
        _id: 0,
        userId: 1,
        docId: 1,
        topic: 1,
        curriculum: 1,
        createdAt: 1,
        updatedAt: 1
      }
    );

    if (!curriculum) {
      return res.status(404).json({
        status: "error",
        message: "Curriculum not found"
      });
    }

    /* ============================
       Success Response
    ============================ */
    return res.status(200).json({
      status: "success",
      data: curriculum
    });
  } catch (error) {
    console.error("Find Curriculum Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch curriculum",
      error: error.message
    });
  }
};


export const findAllCurriculumsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    /* ============================
       Validation
    ============================ */
    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "userId is required"
      });
    }

    /* ============================
       Fetch Curriculums
    ============================ */
    const curriculums = await Navigation.find(
      { userId },
      {
        _id: 0,
        userId: 1,
        docId: 1,
        topic: 1,
        createdAt: 1,
        updatedAt: 1,
        "curriculum.module_number": 1,
        "curriculum.title": 1
      }
    ).sort({ createdAt: -1 });

    /* ============================
       Empty State
    ============================ */
    if (!curriculums || curriculums.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No curriculums found for this user"
      });
    }

    /* ============================
       Success Response
    ============================ */
    return res.status(200).json({
      status: "success",
      count: curriculums.length,
      data: curriculums
    });
  } catch (error) {
    console.error("Find All Curriculums Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch curriculums",
      error: error.message
    });
  }
};