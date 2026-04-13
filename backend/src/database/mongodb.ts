import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    if (!process.env.MONGODB_URL) {
        throw new Error('❌ MONGODB_URL is not defined!');
    }

    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully');
};

export async function connectDatabaseTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URL + "_test");
        console.log("Connected to MongoDB test database");
    } catch (error) {
        console.error("Database Error:", error);
        process.exit(1);
    }
}