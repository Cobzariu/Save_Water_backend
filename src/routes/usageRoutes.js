const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Usage = mongoose.model("Usage");
const Household = mongoose.model("Household");

const router = express.Router();

router.use(requireAuth);

router.get("/usage", async (req, res) => {
  const households = await Household.find({ userId: req.user._id });
  if (households.length === 0) {
    return res
      .status(422)
      .send({ error: "Could not find household for the user" });
  }
  const household = households[0];
  const usages = await Usage.find({ householdId: household._id }).sort(
    "year month"
  );
  res.send({ usages });
});

router.delete("/usage/:id", async (req, res) => {
  const usage_id = req.params.id;
  const delete_response = await Usage.deleteOne({ _id: usage_id });
  if (delete_response.ok === 1 && delete_response.n === 1)
    return res.status(204).send();
  else return res.status(422).send({ error: "Could not delete usage" });
});

router.post("/usage", async (req, res) => {
  const { amount, year, month } = req.body;
  const households = await Household.find({ userId: req.user._id });
  if (households.length === 0) {
    return res
      .status(422)
      .send({ error: "Could not find household for the user" });
  }
  const household = households[0];
  const usages = await Usage.find({ householdId: household._id, month, year });
  if (usages.length > 0) {
    return res.status(422).send({
      error: "You already added consumption data\n for this month and year",
    });
  }
  try {
    const usage = new Usage({
      amount,
      month,
      year,
      householdId: household._id,
    });
    await usage.save();
    res.send({ usage });
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
