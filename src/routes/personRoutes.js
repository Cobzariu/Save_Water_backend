const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Person = mongoose.model("Person");
const Household = mongoose.model("Household");

const router = express.Router();

router.use(requireAuth);

router.get("/person", async (req, res) => {
  const households = await Household.find({ userId: req.user._id });
  if (households.length === 0) {
    return res
      .status(422)
      .send({ error: "Could not find household for the user" });
  }
  const household = households[0];
  const persons = await Person.find({ householdId: household._id });
  res.send({ persons });
});

router.post("/person", async (req, res) => {
  const {
    name,
    showerNumberWeek,
    bathNumberWeek,
    showerLengthMinutes,
    waterRunningBrushingTeeth,
  } = req.body;
  const households = await Household.find({ userId: req.user._id });
  if (households.length === 0) {
    return res
      .status(422)
      .send({ error: "Could not find household for the user" });
  }
  const household = households[0];
  try {
    const person = new Person({
      name,
      showerNumberWeek,
      bathNumberWeek,
      showerLengthMinutes,
      waterRunningBrushingTeeth,
      householdId: household._id,
    });
    await person.save();
    res.send({person});
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
