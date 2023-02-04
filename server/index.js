import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from "./routes/posts.js";

const CONNECTION_URL =
  "mongodb+srv://lamdan0901:lamdan0901@cluster0.wd3um.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

const app = express();
app.use("/posts", postRoutes);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// The Mongoose library is currently using the "strictQuery" option and that this option will be switched back to "false" in Mongoose 7 by default.
// Mongoose uses this option to determine whether to enforce strict query syntax.
// When set to "false", Mongoose will allow query conditions to match multiple properties.
mongoose.set("strictQuery", false);
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true, // these options are for avoiding errors, warnings in the console
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log("Server is running on port " + PORT))
  )
  .catch((err) => console.error(err.message));
