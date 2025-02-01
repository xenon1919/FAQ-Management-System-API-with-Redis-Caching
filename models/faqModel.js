const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: Map,
      of: String,
      required: true,
    },
    answer: {
      type: Map,
      of: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FAQ = mongoose.model("FAQ", faqSchema);
module.exports = FAQ;
