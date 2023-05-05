import crypto from "crypto";
import bcrypt from "bcrypt";
import { connect } from "getstream";
// import stream from "stream-chat";
import { StreamChat } from "stream-chat";
// import StreamChat from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const apiAppId = process.env.STREAM_API_APP_ID;

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, phoneNumber } = req.body;
    // if (!fullName || !username || !password || !phoneNumber) {
    //   return res
    //     .status(400)
    //     .json({ errorMessage: "Please enter all required fields." });
    // }
    // if (password.length < 6) {
    //   return res.status(400).json({
    //     errorMessage: "Please enter a password of at least 6 characters.",
    //   });
    // }
    const userId = crypto.randomBytes(16).toString("hex");
    const serverClient = connect(apiKey, apiSecret, apiAppId);
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createUserToken(userId);

    res
      .status(200)
      .json({ token, fullName, username, userId, hashedPassword, phoneNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const serverClient = connect(apiKey, apiSecret, apiAppId);
    const client = StreamChat.getInstance(apiKey, apiSecret);

    const { users } = await client.queryUsers({ name: username });
    if (!users.length)
      return res.status(400).json({ errorMessage: "User not found" });
    const user = users[0];
    if (!user.hashedPassword)
      return res.status(500).json({ errorMessage: "Invalid user data" });
    const success = await bcrypt.compare(password, user.hashedPassword);
    const token = serverClient.createUserToken(users[0].id);

    if (success) {
      res.status(200).json({
        token,
        fullName: users[0].fullName,
        username,
        userId: users[0].id,
        hashedPassword: users[0].hashedPassword,
        phoneNumber: users[0].phoneNumber,
        avatarURL: users[0].avatarURL,
      });
    } else {
      res.status(500).json({ errorMessage: "Incorrect password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};
