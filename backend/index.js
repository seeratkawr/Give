import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api", authRoutes);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
