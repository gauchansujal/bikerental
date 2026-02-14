import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.MONGODB_URL) {
    console.error('❌ MONGODB_URL is not defined in .env file');
    console.error('   Check if .env file exists and contains MONGODB_URL=...');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ DB Connection Error:', error);
    process.exit(1);
  }
};
export async function connectDatabaseTest(){
    try {
        await mongoose.connect(process.env.MONGODB_URL + "_test");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Database Error:", error);
        process.exit(1); // Exit process with failure
    }
}