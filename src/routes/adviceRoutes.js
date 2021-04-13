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

  // Average shower length
  var average = 0;
  people.forEach((element) => {
    average += element.showerLengthMinutes;
  });
  average /= people.length;
  people.forEach((element) => {
    if (element.showerLengthMinutes > average) {
      let advice = new Advice(
        element.name + " should reduce the length of a shower",
        "person",
        3
      );
      advices.push(advice);
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
  res.send({ advices });
});

module.exports = router;
