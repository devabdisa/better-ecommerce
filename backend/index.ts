// packages
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

//utils
import connectDB from "./config/db.js";

dotenv.config();
const port: string | number = process.env.PORT || 5001;

connectDB();

const app = express();

// Trust proxy for secure cookies (Render handles SSL at the load balancer)
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/orders", orderRoutes);

// Health check route for cron-job.org to ping and keep the server awake
app.get("/ping", (req, res) => {
  res.status(200).send("Server is awake");
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
