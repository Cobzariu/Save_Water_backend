require("./models/user");
require("./models/person");
require("./models/houselhold");
require("./models/usage");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const householdRoutes = require("./routes/householdRoutes");
const personRoutes = require("./routes/personRoutes");
const usageRoutes = require("./routes/usageRoutes");
const adviceRoutes = require("./routes/adviceRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);
app.use(householdRoutes);
app.use(personRoutes);
app.use(usageRoutes);
app.use(adviceRoutes);
app.use(statisticsRoutes);

const mongoUri =
  "MONGO_URI";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});
