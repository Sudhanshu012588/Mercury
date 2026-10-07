import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./DB/config.js"
import NBRoute from "./Routes/ReserchNB.js"
import NavigationRoute from "./Routes/Navigation.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/notebook",NBRoute);
app.use("/navigation",NavigationRoute);
connectDB();
const port = process.env.PORT
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})