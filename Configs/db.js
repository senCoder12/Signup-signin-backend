import mongoose from "mongoose";
import dotenv from "dotenv";
mongoose.set('strictQuery', true);
dotenv.config();

const password = process.env.MONGODB_PASSWORD;
const username = process.env.MONGODB_USERNAME;

const MONGODB_URL = `mongodb+srv://${username}:${password}@cluster0.wuta4ip.mongodb.net/?retryWrites=true&w=majority`
const connection = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Database connection established");
    } catch (error) {
        console.log("Database connection error: " + error);
    }
    
}
export default connection;