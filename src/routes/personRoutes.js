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
  const people = await Person.find({ householdId: household._id });
  res.send({ people });
});

router.post("/person/new", async (req, res) => {
  const {
    name,
    showerNumberWeek,
    bathNumberWeek,
    showerLengthMinutes,
    waterRunningBrushingTeeth,
  } = req.body;
  const households = await Household.find({ userId: req.user._id });
  if (!name) {
    return res.status(422).send({ error: "Must provide a name" });
  }
  if (households.length === 0) {
    return res
      .status(422)
      .send({ error: "Could not find household for the user" });
  }
  const household = households[0];
  await Household.updateOne(
    { userId: req.user._id },
    { personNumber: household.personNumber + 1 }
  );
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
    res.send({ person });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.delete("/person/:id", async (req, res) => {
  const households = await Household.find({ userId: req.user._id });
  if (households.length === 0) {
    return res
      .status(422)
      .send({ error: "Could not find household for the user" });
  }
  const household = households[0];

  const person_id = req.params.id;
  const delete_response = await Person.deleteOne({ _id: person_id });

  if (delete_response.ok === 1 && delete_response.n === 1) {
    await Household.updateOne(
      { userId: req.user._id },
      { personNumber: household.personNumber - 1 }
    );
    return res.status(204).send();
  } else return res.status(422).send({ error: "Could not delete person" });
});

router.put("/person/:id", async (req, res) => {
  const {
    name,
    showerNumberWeek,
    bathNumberWeek,
    showerLengthMinutes,
    waterRunningBrushingTeeth,
  } = req.body;
  if (!name) {
    return res.status(422).send({ error: "Must provide a name" });
  }
  const person_id = req.params.id;
  const updatedPerson = await Person.findOneAndUpdate(
    { _id: person_id },
    {
      name: name,
      showerNumberWeek: showerNumberWeek,
      bathNumberWeek: bathNumberWeek,
      showerLengthMinutes: showerLengthMinutes,
      waterRunningBrushingTeeth: waterRunningBrushingTeeth,
    }
  );
  return res.status(204).send();
});

router.post("/person", async (req, res) => {
  const {
    name,
    showerNumberWeek,
    bathNumberWeek,
    showerLengthMinutes,
    waterRunningBrushingTeeth,
  } = req.body;
  if (!name) {
    return res.status(422).send({ error: "Must provide a name" });
  }
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
    res.send({ person });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
