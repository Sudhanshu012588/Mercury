import express from "express"
import {createNB,getUserNotebooks,saveNotebookReport} from "../controllers/createReserchNB.js"
const router = express.Router();

router.post("/create",createNB)
router.get("/get/:userId", getUserNotebooks);
router.put("/report/:notebookId", saveNotebookReport);


export default router;