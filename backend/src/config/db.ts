import mongoose from "mongoose";

async function connectDB(): Promise<void> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to DB Successfully!");
    } catch (error: any) {
        console.error(error.message);
        process.exit(1);
    }
}

export default connectDB;
