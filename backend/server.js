import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDb } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
const app = express();
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ["http://localhost:5173","https://resumebuilder-frontend-8vou.onrender.com"],
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
const PORT = 3000;
//Connection
connectDb();

app.get("/", (req, res) => {
  res.json({ message: "App is Working!!" });
});
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      res.set("Access-Control-Allow-Origin", "http://loacalhost:5173");
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
