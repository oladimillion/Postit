import db from "../models/db"

const UserGroups = db.UserGroups;
const Groups = db.Groups;

export function JoinGroup(req, res) {

  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid group id"
    });

  } else if (!req.body.userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid user id"
    });

  } else if (!req.session.userId) {
    return res.status(400).json({
      success: false,
      message: "Please login"
    });

  }

  UserGroups.create({
      /**
       * adds the user to 
       * the new group
       */
      // id: data.length + 1,
      groupId: req.params.id,
      userId: req.body.userId,
    })
    .then((data) => {
      return res.status(201).json({
        success: true,
        message: "User added successful"
      });
    })
    .catch((error) => {
      if (error.name === "SequelizeDatabaseError" ||
        error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          success: false,
          message: `Group or user does not exist`
        });
      } else if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          success: false,
          message: `User already in this group`
        });
      } else if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          success: false,
          message: "Please provide a user id"
        });
      } else {
        return res.status(400).json({
          success: false,
          message: error
        });
      }

    });


}