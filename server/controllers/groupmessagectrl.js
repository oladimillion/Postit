import db from "../models/db"

const Messages = db.Messages;
const Users = db.Users;
const Groups = db.Groups;
const GroupMessages = db.GroupMessages;

export function GetGroupMessages(req, res) {

  if (!req.session.userId) {
    return res.status(400).json({
      success: false,
      message: "Please login"
    });

  }

  GroupMessages.findAll({
    where: {
      groupId: req.params.id
    },
    attributes: ['groupId'],
    include: [{
        model: Users,
        attributes: ["username"]
      },
      {
        model: Groups,
        attributes: ["groupName"]
      },
      {
        model: Messages,
        attributes: ["message"]
      }
    ],
  }).then(result => {
    if (result.length !== 0) {
      return res.status(201).json({
        success: true,
        message: result
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "No message for this group"
      });
    }
  }).catch((error) => {
    return res.status(400).json({
      success: false,
      message: "Can not fetch message(s) for this group"
    })
  });
}