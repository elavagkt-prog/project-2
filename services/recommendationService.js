const Scheme = require("../models/Scheme");

exports.recommendSchemes = async (userData) => {
  // userData should include:
  // text (life-event info), age, income, state
  const { text, age, income, state } = userData;

  const lowerText = text.toLowerCase();

  // 1️⃣ Life-event detection
  let lifeEventsFilter = [];
  if (lowerText.includes("student")) lifeEventsFilter.push("student");
  if (lowerText.includes("farmer")) lifeEventsFilter.push("farmer");
  if (lowerText.includes("job") || lowerText.includes("unemployed"))
    lifeEventsFilter.push("unemployed");

  // 2️⃣ Build MongoDB query
  const schemes = await Scheme.find({
    lifeEvents: { $in: lifeEventsFilter },
  });

  // 3️⃣ Apply eligibility checks in code
  const eligibleSchemes = schemes.map((scheme) => {
    let eligible = true;
    let reasons = [];

    // Age check
    if (scheme.minAge && age < scheme.minAge) {
      eligible = false;
      reasons.push(`Minimum age required: ${scheme.minAge}`);
    }
    if (scheme.maxAge && age > scheme.maxAge) {
      eligible = false;
      reasons.push(`Maximum age allowed: ${scheme.maxAge}`);
    }

    // Income check
    if (scheme.incomeLimit && income > scheme.incomeLimit) {
      eligible = false;
      reasons.push(`Income should be below ₹${scheme.incomeLimit}`);
    }

    // State check
    if (
      scheme.eligibleStates.length > 0 &&
      !scheme.eligibleStates.includes("All") &&
      !scheme.eligibleStates.includes(state)
    ) {
      eligible = false;
      reasons.push(`Scheme not available in ${state}`);
    }

    return {
      ...scheme.toObject(),
      eligible,
      reasons,
    };
  });

  return eligibleSchemes;
};
// AI-style scheme recommendation
exports.recommendSchemesAI = async (req, res) => {
  try {
    const { translatedText, age, income, state } = req.body;

    // Pass data to recommendation service
    const schemes = await recommendSchemes({ 
      text: translatedText, 
      age, 
      income, 
      state 
    });

    res.json({
      query: translatedText,
      recommendations: schemes,
      count: schemes.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



