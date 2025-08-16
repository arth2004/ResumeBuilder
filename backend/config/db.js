import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongoose connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connectint to MongoDB", error);
    process.exit(1);
  }
};
