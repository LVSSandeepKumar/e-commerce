import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

import { protectRoute } from "./middleware/protectRoute.js";
import connectToDB from "./utils/connectDB.js";

dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express(); //App Setup
const PORT = process.env.PORT;

app.use(express.json()); //allows users to parse payloads with json requests
app.use(cookieParser()); //allows users to parse headers with cookies

app.use("/api/auth", authRoutes); // Routes for authentication
app.use("/api/post",protectRoute, postRoutes); // Routes for posts

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
    connectToDB();
})