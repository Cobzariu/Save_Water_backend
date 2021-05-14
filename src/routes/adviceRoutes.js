const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Advice = require("../models/advice");
const generalAdvices = require("../utils/generalAdvices.js");
const Usage = mongoose.model("Usage");
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
  var averageShowerLength = 0,
    averageShowerFrequency = 0,
    averageBathFrequency = 0;

  var carWashingLiters = 0,
    wateringLiters = 0;
  people.forEach((element) => {
    averageShowerLength += element.showerLengthMinutes;
    averageShowerFrequency += element.showerNumberWeek;
    averageBathFrequency += element.bathNumberWeek;
  });
  const savedLitersShower = averageShowerFrequency * 9;
  advices.push(
    new Advice(
      "You could save " +
        savedLitersShower +
        " liters per week if every person reduced their shower length by just one minute",
      "household",
      1
    )
  );
  averageShowerLength /= people.length;
  averageShowerFrequency /= people.length;
  averageBathFrequency /= people.length;
  people.forEach((element) => {
    if (element.waterRunningBrushingTeeth === true) {
      let advice = new Advice(
        element.name + " should close the tap while using the sink",
        "person",
        2
      );
      advices.push(advice);
    }
    if (element.showerLengthMinutes > averageShowerLength) {
      let advice = new Advice(
        element.name + " should reduce the length of a shower",
        "person",
        1
      );
      advices.push(advice);
    }
    if (element.showerNumberWeek + element.bathNumberWeek > 7) {
      if (element.showerNumberWeek > averageShowerFrequency) {
        let advice = new Advice(
          element.name + " should reduce the frequency of showers",
          "person",
          1
        );
        advices.push(advice);
      }
      if (element.bathNumberWeek > averageBathFrequency) {
        let advice = new Advice(
          element.name + " should reduce the frequency of baths",
          "person",
          1
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
      3
    );
    advices.push(advice);
  }
  if (household.toiletDualFlush === false) {
    let advice = new Advice(
      "Consider upgrading your toilets to dual flush ones",
      "household",
      3
    );
    advices.push(advice);
  }

  //Outside section
  if (household.locationTypeHouse === true) {
    if (household.collectRainwater === false) {
      let advice = new Advice(
        "Consider collecting and using rainwater",
        "household",
        3
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

    advices.push(...generalAdvices.outdoorAdvices);
    carWashingLiters = household.washCarNumberWeek * 250;
    wateringLiters =
      household.waterGardenNumberWeek * household.waterGardenLength * 12;
  }
  //Statistics
  averageShowerLength = Math.round(averageShowerLength);
  averageBathFrequency = Math.round(averageBathFrequency);
  averageShowerFrequency = Math.round(averageShowerFrequency);

  var waterUsedPerCapitaLiters = -1;

  const usages = await Usage.find({ householdId: household._id }).sort(
    "year month"
  );
  if (usages.length > 0) {
    const lastUsage = usages[usages.length - 1];
    waterUsedPerCapitaLiters = Math.round(
      (lastUsage.amount * 1000) / (30 * people.length)
    );
  }
  advices.push(...generalAdvices.indoorAdvices);
  advices = advices.sort((a, b) =>
    a.priority > b.priority ? 1 : b.priority > a.priority ? -1 : 0
  );
  res.send({
    advices,
    statistics: {
      averageShowerLength,
      averageBathFrequency,
      averageShowerFrequency,
      waterUsedPerCapitaLiters,
      carWashingLiters,
      wateringLiters,
    },
  });
});

module.exports = router;
