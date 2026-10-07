import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const ConnectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        if(ConnectionInstance){
            console.log("Mongodb Connected");
        }else{
            throw new Error("Mongodb Conenction error");
        }
    } catch (error) {
        console.log(error);
    }
}