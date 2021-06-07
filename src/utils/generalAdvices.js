const Advice = require("../models/advice");

indoorAdvices = [
  new Advice("Check for leaks", "general", 3),
  new Advice("Do not use all the water in the toilet tank when flushing", "general", 3),
];

outdoorAdvices = [
  new Advice("Try do reduce the length of the watering", "outside", 3),
  new Advice(
    "Every time you wash the car you use 250 liters of water",
    "outside",
    2
  ),
];

module.exports = { indoorAdvices, outdoorAdvices };
