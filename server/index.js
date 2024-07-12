import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();
app.use(cors());
app.use(express.json({ limit: "1GB" }));

app.use("/auth", userRoutes);
app.use("/message", messageRoutes);
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
