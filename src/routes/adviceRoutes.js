const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");
const Advice = require("../models/advice");

const Person = mongoose.model("Person");
const Household = mongoose.model("Household");
const router = express.Router();

router.use(requireAuth);

router.get("/advice", async (req, res) => {
  const households = await Household.find({ userId: req.user._id });
  var advices = [];
  const household = households[0];
  const people = await Person.find({ householdId: household._id });

  // Average shower length and frequency
  var averageLength = 0,
    averageShowerFrequency = 0,
    averageBathFrequency = 0;
  people.forEach((element) => {
    averageLength += element.showerLengthMinutes;
    averageShowerFrequency += element.showerNumberWeek;
    averageBathFrequency += element.bathNumberWeek;
  });
  averageLength /= people.length;
  averageShowerFrequency /= people.length;
  averageBathFrequency /= people.length;
  people.forEach((element) => {
    if (element.showerLengthMinutes > averageLength) {
      let advice = new Advice(
        element.name + " should reduce the length of a shower",
        "person",
        3
      );
      advices.push(advice);
    }
    if (element.showerNumberWeek + element.bathNumberWeek > 7) {
      if (element.showerNumberWeek > averageShowerFrequency) {
        let advice = new Advice(
          element.name + " should reduce the frequency of showers",
          "person",
          3
        );
        advices.push(advice);
      }
      if (element.bathNumberWeek > averageBathFrequency) {
        let advice = new Advice(
          element.name + " should reduce the frequency of baths",
          "person",
          3
        );
        advices.push(advice);
      }
    }
  });

  //Household section
  if (household.washingMachineFullLoad === false) {
    let advice = new Advice(
      "You should fully load the washing machine before using it",
      "household",
      2
    );
    advices.push(advice);
  }
  if (household.bowlWashing === false) {
    let advice = new Advice(
      "You could use a bowl to rinse your dishes",
      "household",
      1
    );
    advices.push(advice);
  }
  if (household.toiletDualFlush === false) {
    let advice = new Advice(
      "Consider upgrading your toilets to dual flush ones",
      "household",
      1
    );
    advices.push(advice);
  }

  //Outside section
  if (household.locationTypeHouse === true) {
    if (household.collectRainwater === false) {
      let advice = new Advice(
        "Consider collecting and using rainwater",
        "household",
        1
      );
      advices.push(advice);
    }
    if (household.washCarNumberWeek > 3) {
      let advice = new Advice(
        "Try reducing the number of times you wash the car",
        "household",
        2
      );
      advices.push(advice);
    }
  }
  res.send({ advices });
});

module.exports = router;
