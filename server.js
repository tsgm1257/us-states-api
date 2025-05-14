require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/states", require("./routes/states")); // We'll create this later

// 404 Catch-All
app.all("*", (req, res) => {
  res.status(404).format({
    "text/html": () => res.send("<h1>404 Not Found</h1>"),
    "application/json": () => res.json({ error: "404 Not Found" }),
    default: () => res.type("txt").send("404 Not Found"),
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
