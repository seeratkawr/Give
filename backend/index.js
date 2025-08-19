const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");

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
