import db from "../connection"

const UserGroups = db.UserGroups;
const Groups = db.Groups;

export function JoinGroup(req, res) {

  Groups.findAll({
    where: {
      groupId: req.params.id
    }
  }).then(data => {
    if (data.length != 0) {
      UserGroups.create({
          groupId: req.params.id,
          username: req.body.username,
        })
        .then((data) => {
          return res.status(201).json({
            success: true,
            message: "User added successful"
          });
        })
        .catch((error) => {
          if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
              success: false,
              message: "User already in this group"
            });
          } else {
            return res.status(400).json({
              success: false,
              message: error.errors[0].message
            });
          }
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "Group does not exist"
      });
    }
  }).catch((error) => {
    return res.json({
      error: error
    })
  });
}