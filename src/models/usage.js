const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  amount: Number,
  month: Number,
  year: Number,
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
  },
});

mongoose.model("Usage", usageSchema);
