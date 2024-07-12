import messageModel from "../model/messageModel.js";

export async function addMessage(req, res, next) {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (!data)
      return res.json({
        status: 400,
        msg: "Faild to add message to database.",
      });
    return res.json({ status: 200, msg: "Message added successfully." });
  } catch (error) {
    next(error);
  }
}
export async function getAllMessages(req, res, next) {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json({ status: 200, projectMessages });
  } catch (error) {
    next(error);
  }
}
