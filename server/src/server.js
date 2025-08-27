import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { createServer } from "http";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";


dotenv.config({
    path: "../.env"
});

connectDB();
const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
    cors: { origin: "*" }
})

export const notifyEmergency = (sosData) => {
    io.emit("newSOS", sosData);
};

//Auth routes
app.use("/api/auth", authRoutes);

//Add Contact route
app.use("/api/contact", userRoutes);

//Sos routes
app.use("/api/sos", sosRoutes);


app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
