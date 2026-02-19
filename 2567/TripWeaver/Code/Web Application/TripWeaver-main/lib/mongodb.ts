import mongoose from 'mongoose';


export const connectMongoDB = async () => {
    const mongoURI = process.env.MONGDB_URI as string;


    if (mongoose.connection.readyState === 1) {
        return;
    }
    try {
        await mongoose.connect(mongoURI);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw new Error("Failed to connect to MongoDB");
    }
};
