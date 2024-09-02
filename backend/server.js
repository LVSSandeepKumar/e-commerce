import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express(); //App Setup
const PORT = process.env.PORT;

app.use(express.json()); //allows users to parse payloads with json requests

app.use("/api/auth", authRoutes); //custom routes for various utilities

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})