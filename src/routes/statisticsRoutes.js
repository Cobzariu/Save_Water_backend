const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const WaterPoint = require("../models/waterPoint");
const Usage = mongoose.model("Usage");
const Person = mongoose.model("Person");
const Household = mongoose.model("Household");
const router = express.Router();
router.use(requireAuth);

router.get("/statistics/:year", async (req, res) => {
  const year = req.params.year;
  const households = await Household.find({ userId: req.user._id });
  const household = households[0];
  const usages = await Usage.find({
    householdId: household._id,
    year: year,
  }).sort("month");
  const lpdList = usages.map((usage) => {
    const waterUsed = Math.round(
      (usage.amount * 1000) / (30 * household.personNumber)
    );
    return { lpd: waterUsed, month: usage.month };
  });

  var summerAmount = 0,
    winterAmount = 0,
    fallAmount = 0,
    springAmount = 0;
  usages.forEach((usage) => {
    if (usage.month === 0 || usage.month === 1 || usage.month === 11)
      winterAmount += usage.amount;
    else if (usage.month >= 2 && usage.month <= 4) springAmount += usage.amount;
    else if (usage.month >= 5 && usage.month <= 7) summerAmount += usage.amount;
    else if (usage.month >= 8 && usage.month <= 10) fallAmount += usage.amount;
  });
  res.send({
    lpdList,
    seasonsStats: {
      summerAmount,
      winterAmount,
      fallAmount,
      springAmount,
    },
  });
});

router.get("/water_points", async (req, res) => {
  const households = await Household.find({ userId: req.user._id });
  if (households.length === 0) {
    return res
      .status(422)
      .send({ error: "Could not find household for the user" });
  }
  const household = households[0];
  const people = await Person.find({ householdId: household._id });
  var waterPoints = [];
  people.forEach((person) => {
    const showerPoints = person.showerNumberWeek * person.showerLengthMinutes;
    const bathPoints = person.bathNumberWeek * 10;
    var otherPoints = 0;
    if (person.waterRunningBrushingTeeth === true) otherPoints = 10;
    waterPoints.push(
      new WaterPoint(person.name, showerPoints, bathPoints, otherPoints)
    );
  });
  res.send({ waterPoints });
});

module.exports = router;
