const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Household = mongoose.model("Household");

const router = express.Router();

router.use(requireAuth);

router.get("/household", async (req, res) => {
  const households = await Household.find({ userId: req.user._id });
  res.send({ household: households[0] });
});

router.put("/household", async (req, res) => {
  const {
    locationTypeHouse,
    washingMachineNumberWeek,
    washingMachineFullLoad,
    washHandNumberWeek,
    bowlWashing,
    dishwasherNumberWeek,
    toiletDualFlush,
    washCarNumberWeek,
    waterGardenNumberWeek,
    waterGardenLength,
    collectRainwater,
  } = req.body;
  const households = await Household.find({ userId: req.user._id });
  const household = households[0];
  const updateHousehold = await Household.findOneAndUpdate(
    { _id: household._id },
    {
      locationTypeHouse: locationTypeHouse,
      washingMachineNumberWeek: washingMachineNumberWeek,
      washingMachineFullLoad: washingMachineFullLoad,
      washHandNumberWeek: washHandNumberWeek,
      bowlWashing: bowlWashing,
      dishwasherNumberWeek: dishwasherNumberWeek,
      toiletDualFlush: toiletDualFlush,
      washCarNumberWeek: washCarNumberWeek,
      waterGardenNumberWeek: waterGardenNumberWeek,
      waterGardenLength: waterGardenLength,
      collectRainwater: collectRainwater,
    }
  );
  return res.status(204).send();
});

router.post("/household", async (req, res) => {
  const {
    locationTypeHouse,
    personNumber,
    washingMachineNumberWeek,
    washingMachineFullLoad,
    washHandNumberWeek,
    bowlWashing,
    dishwasherNumberWeek,
    toiletDualFlush,
    washCarNumberWeek,
    waterGardenNumberWeek,
    waterGardenLength,
    collectRainwater,
  } = req.body;
  const households = await Household.find({ userId: req.user._id });
  if (households.length > 0)
    return res
      .status(422)
      .send({ error: "User has already entered his household details" });
  try {
    const household = new Household({
      locationTypeHouse,
      personNumber,
      washingMachineNumberWeek,
      washingMachineFullLoad,
      washHandNumberWeek,
      bowlWashing,
      dishwasherNumberWeek,
      toiletDualFlush,
      washCarNumberWeek,
      waterGardenNumberWeek,
      waterGardenLength,
      collectRainwater,
      userId: req.user._id,
    });
    await household.save();
    res.send({ household });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
