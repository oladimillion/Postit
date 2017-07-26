import db from "../models/db"

const Messages = db.Messages;
const GroupMessages = db.GroupMessages;

export function PostMessage(req, res) {

  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid group id"
    });

  } else if (!req.body.message) {
    return res.status(400).json({
      success: false,
      message: "Message field cannot be empty"
    });

  } else if (!req.session.userId) {
    return res.status(400).json({
      success: false,
      message: "Please login"
    });

  }

  Messages.findAll({})
    .then(data => {
      return Messages.create({
        messageId: data.length + 1,
        message: req.body.message,
        groupId: req.params.id
      })
    })
    .then((message) => {
      return GroupMessages.create({
        userId: req.session.userId,
        messageId: message.messageId,
        groupId: req.params.id
      })
    })
    .then((result) => {
      return res.status(201).json({
        success: true,
        message: "Message sent"
      });
    })
    .catch((error) => {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          success: false,
          message: "Message field cannot be empty"
        });
      } else if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          success: false,
          message: `Group does not exist`
        });
      } else {
        return res.status(400).json({
          success: false,
          message: error
        });
      }
    });

}