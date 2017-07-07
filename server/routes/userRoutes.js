const db = require("../model/model");


let RegUser = db.RegUser;
let FindOneUser = db.FindOneUser;


exports.routes = (app) => {
    app.post("/user/signin", (req, res) => {
        let userObj = {
            username: req.body.username,
            password: req.body.password
        };

        FindOneUser(userObj, (result) => {
            return res.json(result);
        });
    });

    app.post("/user/signup", (req, res) => {
        if (req.body.password !== req.body.cpassword) {
            return res.json({ success: false, message: "Password do not match" });
        }

        let userObj = {
            username: req.body.username,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            groups: req.body.groups
        };
        RegUser(userObj, (result) => {
            return res.json(result);
        });
    });
}