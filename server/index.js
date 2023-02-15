import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/users.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

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
