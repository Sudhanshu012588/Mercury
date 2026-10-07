import {saveCurriculum,findCurriculum,findAllCurriculumsByUser} from "../controllers/Navigation.js";
import express from "express";

const router = express.Router();

router.post("/save",saveCurriculum);
router.get("/get/:userId/:docId", findCurriculum);
router.get("/user/:userId", findAllCurriculumsByUser);

export default router;