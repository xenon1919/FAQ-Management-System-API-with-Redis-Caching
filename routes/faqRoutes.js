const express = require("express");
const router = express.Router();
const {
  createFAQ,
  getFAQs,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

// Route to create a new FAQ
router.post("/", createFAQ);

// Route to fetch all FAQs
router.get("/", getFAQs);

// Route to update an FAQ
router.put("/:id", updateFAQ);

// Route to delete an FAQ
router.delete("/:id", deleteFAQ);

module.exports = router;
