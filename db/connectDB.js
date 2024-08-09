import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};
