const db = require("../model/model");

let AddUserToGroup = db.AddUserToGroup;
let CreateNewGroup = db.CreateNewGroup;
let PostMessage = db.PostMessage;
let FindGroupMsg = db.FindGroupMsg;


exports.routes = (app) => {
    //create broadcast group
    app.post("/group", (req, res) => {
        console.log("body: ", req.body);

        let groupname = req.body.groupname;
        let username = req.body.username;

        CreateNewGroup(username, groupname, (data) => {
            return res.json(data);
        });
    });

    //add other users to group
    app.post("/group/:id/user", (req, res) => {
        AddUserToGroup(req.body.username, req.params.id, (data) => {
            return res.send(data);
        });
    });

    //post message to group
    app.post("/group/:id/message", (req, res) => {
        let data = {
            username: req.body.username,
            groupid: req.params.id,
            message: req.body.message
        };
        PostMessage(data, (result) => {
            return res.send(result);
        });
    });

}