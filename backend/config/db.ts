import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!); // Add non-null assertion
    console.log(`Successfully connnected to mongoDB 👍`);
  } catch (error: any) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
