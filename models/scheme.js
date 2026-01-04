const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    lifeEvents: [
      {
        type: String, // student, farmer, unemployed, marriage, disability
      },
    ],

    eligibleStates: [
      {
        type: String, // Tamil Nadu, Karnataka, All
      },
    ],

    minAge: Number,
    maxAge: Number,

    incomeLimit: Number,

    requiredDocuments: [
      {
        type: String,
      },
    ],

    category: {
      type: String, // SC / ST / OBC / General / All
      default: "All",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scheme", schemeSchema);
