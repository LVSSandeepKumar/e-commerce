import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import connectToDB from "./utils/connectDB.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express(); //App Setup
const PORT = process.env.PORT;

app.use(express.json()); //allows users to parse payloads with json requests
app.use(cookieParser()); //allows users to parse headers with cookies

app.use("/api/auth", authRoutes); //custom routes for various utilities

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
    connectToDB();
})