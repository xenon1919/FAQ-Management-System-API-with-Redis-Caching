const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const faqRoutes = require("./routes/faqRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use FAQ routes
app.use("/api/faqs", faqRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/faq_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
