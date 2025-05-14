require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route: Serve root HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API Routes
app.use("/states", require("./routes/states"));

// 404 Catch-All
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.send(
      "<!DOCTYPE html><html><head><title>404</title></head><body><h1>404 Not Found</h1></body></html>"
    );
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
