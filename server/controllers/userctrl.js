import db from "../connection"

const Users = db.Users;

export function SignUp(req, res) {

  if (req.body.password !== req.body.cpassword) {
    return res.status(201).json({
      success: false,
      message: "Password do not match"
    })
  }

  Users.create({
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password
    })
    .then((data) => {
      if (data) {

        return res.status(201).json({
          success: true,
          message: "Registration Successful"
        });
      } else {
        return res.status(400).json({
          success: true,
          message: data
        });
      }
    })
    .catch((error) => {
      if (error.errors[0].message == "") {
        return res.status(400).json({
          success: false,
          message: "All fields are required!"
        });
      } else {
        return res.status(400).json({
          success: false,
          message: error.errors[0].message
        });
      }
    });

}

export function SignIn(req, res) {

  Users.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    })
    .then((data) => {
      if (data === null) {
        return res.status(400).json({
          success: false,
          message: "Please register before login"
        });
      } else {

        req.session.username = req.body.username;

        return res.status(201).json({
          success: true,
          message: "Welcome"
        })
      }

    })
    .catch((error) => {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    });

}