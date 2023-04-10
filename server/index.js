const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/users");
const auth2Routes = require("./routes/users2");
const habitRoutes = require("./routes/habits");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth2", auth2Routes);
app.use("/api/habits", habitRoutes);

// The Mongoose library is currently using the "strictQuery" option and that this option will be switched back to "false" in Mongoose 7 by default.
// Mongoose uses this option to determine whether to enforce strict query syntax.
// When set to "false", Mongoose will allow query conditions to match multiple properties.
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true, // these options are for avoiding errors, warnings in the console
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log("Server is running on port " + PORT))
  )
  .catch((err) => console.error(err.message));
