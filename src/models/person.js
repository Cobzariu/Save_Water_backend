const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  showerNumberWeek: Number,
  bathNumberWeek: Number,
  showerLengthMinutes: Number,
  waterRunningBrushingTeeth: Boolean,
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
  },
});

mongoose.model("Person", personSchema);