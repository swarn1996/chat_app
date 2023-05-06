import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import twilio from "twilio";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// client.messages
//   .create({
//     from: "+13184968412",
//     to: "+918557007641",
//   })
//   .then((message) => console.log(message.sid));
// // .done();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const { message, user: sender, type, members } = req.body;

  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          client.messages
            .create({
              body: `You have a new message from ${message.user.fullName} - ${message.text}`,
              from: "+13184968412",
              to: user.phoneNumber,
            })
            .then((message) =>
              console.log(message.sid).catch((err) => console.log(err))
            );
        }
      });
    return res.status(200).send("Message sent");
  }
  return res.status(200).send("Not a new message request");
});

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
