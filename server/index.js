import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();
app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
