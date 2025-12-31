import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load .env

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(uri); // no unsupported options
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

