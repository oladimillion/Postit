import db from "../models/db"

const Groups = db.Groups;
const UserGroups = db.UserGroups;

export function NewGroup(req, res) {

  if (!req.body.groupname) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid group name"
    });

  } else if (!req.session.userId) {
    return res.status(400).json({
      success: false,
      message: "Please login"
    });

  }

  Groups.findAll({})
    .then(data => {
      return Groups.create({
        groupId: data.length + 1,
        groupName: req.body.groupname,
        userId: req.session.userId,
      })
    })
    .then((group) => {
      return UserGroups.create({
        userId: group.userId,
        groupId: group.groupId
      })
    }).then((result) => {
      return res.status(201).json({
        success: true,
        message: "Group successfully created"
      })
    })
    .catch((error) => {
      if (error.errors[0].message === "") {
        return res.status(400).json({
          success: false,
          message: "Please provide a group name"
        });
      } else {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message
        });
      }
    });
}