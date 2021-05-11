const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Usage = mongoose.model("Usage");
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

module.exports = router;
