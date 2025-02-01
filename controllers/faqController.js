const FAQ = require("../models/faqModel");
const redis = require("redis");

const client = redis.createClient();
client.on("error", (err) => {
  console.log("Redis error:", err);
});

// Create a new FAQ
const googleTranslate = require("@vitalets/google-translate-api");

// Function to automatically translate question and answer into different languages
const translateText = async (text, targetLang = "en") => {
  try {
    const res = await googleTranslate(text, { to: targetLang });
    return res.text; // Return the translated text
  } catch (err) {
    console.error("Translation error:", err);
    return text; // Fallback to original text in case of error
  }
};

// Create a new FAQ with automatic translations
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer || !question.en || !answer.en) {
      return res.status(400).json({
        message:
          "Both question and answer are required, including English translations.",
      });
    }

    // Translate question and answer to additional languages (e.g., 'hi', 'fr', 'es', etc.)
    const languages = ["hi", "fr", "es"]; // You can add more languages here

    const translatedQuestions = {};
    const translatedAnswers = {};

    for (const lang of languages) {
      translatedQuestions[lang] = await translateText(question.en, lang);
      translatedAnswers[lang] = await translateText(answer.en, lang);
    }

    // Create FAQ document
    const newFAQ = new FAQ({
      question: { ...question, ...translatedQuestions },
      answer: { ...answer, ...translatedAnswers },
    });

    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating FAQ", error: error.message });
  }
};

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching FAQs", error: error.message });
  }
};

// Get FAQ by ID with translation support
exports.getFAQById = async (req, res) => {
  const { id } = req.params;
  const { lang = "en" } = req.query; // Default language is 'en' if not provided

  // Check Redis cache first
  const cachedTranslation = await client.get(`faq_translation_${id}_${lang}`);

  if (cachedTranslation) {
    return res.status(200).json(JSON.parse(cachedTranslation)); // Return cached translation
  }

  try {
    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Get translation for the specific language
    const translatedFAQ = {
      question: faq.question[lang] || faq.question.en, // Fallback to English
      answer: faq.answer[lang] || faq.answer.en, // Fallback to English
    };

    // Cache the translated FAQ in Redis for future requests
    await client.setex(
      `faq_translation_${id}_${lang}`,
      3600,
      JSON.stringify(translatedFAQ)
    ); // Cache for 1 hour

    res.status(200).json(translatedFAQ); // Return translated FAQ
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching FAQ", error: error.message });
  }
};

// Update an FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer || !question.en || !answer.en) {
      return res.status(400).json({
        message:
          "Both question and answer are required, including English translations.",
      });
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json(updatedFAQ);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating FAQ", error: error.message });
  }
};

// Delete an FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFAQ = await FAQ.findByIdAndDelete(id);

    if (!deletedFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    // Remove cached translations from Redis
    await client.del(`faq_translation_${id}_en`); // Delete cached English version
    // Optionally, delete translations for other languages as well
    await client.del(`faq_translation_${id}_hi`);
    await client.del(`faq_translation_${id}_bn`);

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting FAQ", error: error.message });
  }
};
