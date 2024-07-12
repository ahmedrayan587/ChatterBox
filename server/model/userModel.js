import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
});

export default mongoose.model("User", userSchema);
