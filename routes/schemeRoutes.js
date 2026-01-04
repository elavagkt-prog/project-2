const express = require("express");
const router = express.Router();
const schemeController = require("../controllers/schemeController");

// Example in schemeController.js
router.get("/", schemeController.testRoute);



// add scheme
router.post("/add", schemeController.addScheme);

// filter schemes
router.get("/search", schemeController.getSchemesByFilter);

// eligibility check
router.post("/check-eligibility", schemeController.checkEligibility);

// document readiness
router.post("/check-documents", schemeController.checkDocuments);
// AI recommendations
router.post("/recommend", schemeController.recommendSchemesAI);
// AI recommendations
router.post("/recommend", schemeController.recommendSchemesAI);
// AI recommendations
router.post("/recommend-ai", schemeController.recommendSchemesAI);

module.exports = router;
