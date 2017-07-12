import {AddUserToGroup, CreateNewGroup}  from "../model/model";
import {PostMessage, FindGroupMsg, MsgReader}  from "../model/model";

"use strict";

export default function GroupRoutes (app) {
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
      return res.json(data);
    });
  });

    //post message to group
  app.post("/group/:id/message", (req, res) => {
    let data = {
      username: req.body.username,
      groupid: req.params.id,
      message: req.body.message
    };

    if(data.message.length === 0){
      return res.json({
        success: false, 
        message: "You can't send empty message"
      });
    }

    PostMessage(data, (result) => {
      return res.json(result);
    });
  });

  app.post("/group/:grpid/:msgid/:username", (req, res) => {
    
    //logs reader name of a particular message in the database

    let data = {
      groupid: req.params.grpid,
      usermsgid: req.params.msgid,
      username: req.params.username
    }
    
  });

  app.get("/group/:id/message", (req, res) => {

    MsgReader(req.params.id, reg.body.username);

    FindGroupMsg(req.params.id, (result)=>{
      return res.json(result);
    });
  });

}