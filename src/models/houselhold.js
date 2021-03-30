const mongoose = require("mongoose");

const householdSchema = new mongoose.Schema({
  locationTypeHouse:Boolean,
  personNumber: Number,
  washingMachineNumberWeek: Number,
  washingMachineFullLoad: Boolean,
  washHandNumberWeek: Number,
  bowlWashing: Boolean,
  dishwasherNumberWeek: Number,
  toiletDualFlush: Boolean,
  washCarNumberWeek: Boolean,
  waterGardenNumberWeek: Number,
  waterGardenLength: Number,
  collectRainwater: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

mongoose.model("Household", householdSchema);
