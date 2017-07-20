import db from "../connection"

const Messages = db.Messages;

export function PostMessage(req, res) {

  Groups.findAll({
    where: {
      groupId: req.params.id
    }
  }).then(data => {
    if (data.length != 0) {
      Messages.create({
          message: req.body.message,
          username: req.session.username,
          groupId: req.params.id
        })
        .then((data) => {
          if (data) {
            return res.status(201).json({
              success: true,
              message: "Message sent"
            });
          }
        })
        .catch((error) => {
          return res.status(400).json({
            success: true,
            message: error.errors[0].message
          });
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