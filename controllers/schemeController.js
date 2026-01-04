const Scheme = require("../models/Scheme");
const { recommendSchemes } = require("../services/recommendationService");

// ===== Test Route =====
exports.testRoute = (req, res) => {
  res.json({ message: "API is working!" });
};

// ===== Add Scheme =====
exports.addScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ scheme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Get Schemes by Filter / Search =====
exports.getSchemesByFilter = async (req, res) => {
  try {
    const filters = req.query || {};
    const schemes = await Scheme.find(filters);
    res.json({ count: schemes.length, schemes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Eligibility Check =====
exports.checkEligibility = async (req, res) => {
  try {
    const { schemeId, age, income, state } = req.body;

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    let eligible = true;
    let reasons = [];

    if (scheme.minAge && age < scheme.minAge) {
      eligible = false;
      reasons.push(`Minimum age required: ${scheme.minAge}`);
    }
    if (scheme.maxAge && age > scheme.maxAge) {
      eligible = false;
      reasons.push(`Maximum age allowed: ${scheme.maxAge}`);
    }
    if (scheme.incomeLimit && income > scheme.incomeLimit) {
      eligible = false;
      reasons.push(`Income should be below ₹${scheme.incomeLimit}`);
    }
    if (
      scheme.eligibleStates.length > 0 &&
      !scheme.eligibleStates.includes("All") &&
      !scheme.eligibleStates.includes(state)
    ) {
      eligible = false;
      reasons.push(`Scheme not available in ${state}`);
    }

    res.json({ eligible, reasons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== Document Readiness Checker =====
exports.checkDocuments = async (req, res) => {
  try {
    const { schemeId, userDocuments } = req.body;

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });

    const requiredDocs = scheme.requiredDocuments;
    const missingDocuments = requiredDocs.filter(
      (doc) => !userDocuments.includes(doc)
    );

    res.json({
      requiredDocuments: requiredDocs,
      userDocuments,
      missingDocuments,
      ready:
        missingDocuments.length === 0
          ? "All documents are ready"
          : "Some documents are missing",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===== AI-style Recommendation =====
// Life-event based AI recommendation
// ===== AI-style Recommendation =====
exports.recommendSchemesAI = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const text = query.toLowerCase();

    // Detect life-events from query
    let lifeEvents = [];
    if (text.includes("student")) lifeEvents.push("student");
    if (text.includes("farmer")) lifeEvents.push("farmer");
    if (text.includes("unemployed") || text.includes("job"))
      lifeEvents.push("unemployed");
    if (text.includes("rural")) lifeEvents.push("rural");
    if (text.includes("woman") || text.includes("female"))
      lifeEvents.push("women");

    // If nothing detected, return empty
    if (lifeEvents.length === 0) {
      return res.json({
        query,
        recommendations: [],
        count: 0
      });
    }

    // Fetch schemes from DB
    const schemes = await Scheme.find({
      lifeEvents: { $in: lifeEvents }
    });

    res.json({
      query,
      recommendations: schemes,
      count: schemes.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
