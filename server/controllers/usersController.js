import User from "../model/userModel.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: 400 });

    const emailCheck = await User.findOne({ email });
    if (emailCheck) return res.json({ msg: "Email already used", status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // Remove the password from the response object
    user.password = undefined;

    return res.json({ status: 200, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: 400 });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect username or password", status: 400 });
    user.password = undefined;
    return res.json({ status: 200, user });
  } catch (error) {
    next(error);
  }
};
