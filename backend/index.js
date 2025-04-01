import express from "express";
import { connectDB } from "./config/database.js";

const app = express();

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});