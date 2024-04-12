import mongoose from "mongoose";

export default async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB connected")
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}