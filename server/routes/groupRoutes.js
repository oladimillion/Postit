const db = require("../model/model");


let findAllUser = db.findAllUser;
let createGroup = db.createGroup;
let createMessage = db.createMessage;
let findAllGroup = db.findAllGroup;
let findGroupMsg = db.findGroupMsg;
let findUserGroups = db.findUserGroups;


exports.routes = (app) => {
    //create broadcast group
    app.post("/group", (req, res) => {
        let data = {
            groupName: req.body.groupname,
            username: req.body.username,
            recievedMsgCount: 0,
            sentMsgCount: 0
        }
        createGroup(data, (data)=>{
            return res.send(data);
        });
    });

    //add other users to group
    app.post("/api/group/:id/user", (req, res) => {
        res.send(`adding users to group id ${req.params.id}`);
    });

    //post message to group
    app.post("/api/group/:id/message", (req, res) => {
        res.send(`sending message to group id ${req.params.id}`);
    });

}