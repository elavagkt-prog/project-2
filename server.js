const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const schemeRoutes = require("./routes/schemeRoutes");
require("dotenv").config(); // ← load .env

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

// connect database
connectDB();

app.use(express.json());

// routes
app.use("/api/schemes", schemeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
