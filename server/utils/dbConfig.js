import mongoose from 'mongoose';

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("Error from dbConfig")
    }
}

connectDB();