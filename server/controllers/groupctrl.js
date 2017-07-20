import db from "../connection"

const Groups = db.Groups;
const UserGroups = db.UserGroups;
const Users = db.Users;

export function NewGroup(req, res) {
  Groups.create({
      group_name: req.body.groupname,
      group_admin: req.session.username,
    })
    .then((data) => {
      UserGroups.create({
        groupId: data.groupId,
        username: req.session.username,
      }).then((result) => {
        return res.status(200).json({
          success: true,
          message: "Group successfully created"
        });
      })
    })
    .catch((error) => {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    });
}