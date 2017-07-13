import {AddUserToGroup, CreateNewGroup}  from "../model/model";
import {PostMessage, FindGroupMsg, MsgReader}  from "../model/model";
import {GetMsgReaders, FindAllUser} from "../model/model";
"use strict";

export default function GroupRoutes (app) {

  app.post("*", (req, res, next)=>{

    /**
     * makes sure user is logged
     * in before accessing any resource
     */
    
    if (!req.session.username) {
  
      console.log('checkAuth: ' + req.url);
      
      return res.status(400).json({ 
        success: false,
        message: "Please login" 
      });

    }else{
      next();
    }
  });
  
  app.post("/group", (req, res) => {

   /**  
    * creates new broadcast group
    */
    
    let groupname = req.body.groupname;
    let username = req.session.username;

    CreateNewGroup(groupname, username, (result) => {
     /**
      * inserts groupname and username 
      * into groups and user_groups tables
      */ 
      if(result.success === false){
        return res.status(400).json(result);
      }else{
        return res.status(201).json(result);
      } 
    });
  });

    
  app.post("/group/:id/user", (req, res) => {

    /**
     * adds users to a particular
     * group with the id provided
     */

    if(req.body.username.length === 0 || 
      req.params.id != undefined || 
      isNaN(req.params.id)){
    
      /**
       * ensures all
       * feilds are provided
       */

      return res.status(400).json({
        success: false, 
        message: "Make sure group id and "+ 
                "username are provided"
      });
    }  

    AddUserToGroup(req.params.id, req.body.username, (result) => {

      /**
       * inserts username into the
       * user_groups table
       */

       if(result.success === false){
        return res.status(400).json(result);
      }else{
        return res.status(201).json(result);
      } 
    });
  });

    
  app.post("/group/:id/message", (req, res) => {

    /**
     * dispatches message to a
     * particular group
     */

    let data = {
      username: req.session.username,
      group_id: req.params.id,
      message: req.body.message
    };

    if(data.message.length === 0){

      /**
       * ensures message 
       * feild is not empty
       */

      return res.status(400).json({
        success: false, 
        message: "You can't send blank message"
      });
    }

    PostMessage(data, (result) => {
      if(result.success === false){
        return res.status(400).json(result);
      }else{
        return res.status(201).json(result);
      } 
    });
  });

  // TO DO
  app.post("/group/names/:grp_id/:msg_id", (req, res) => {
    
    /**
     * logs reader nameS of a 
     * particular message
     */

    let group_id = req.params.grp_id,
      msg_id = req.params.msg_id;

      if(msg_id != undefined || 
        isNaN(msg_id) || 
        group_id != undefined || 
        isNaN(group_id)){
    
      /**
       * ensures all
       * feilds are provided
       */

      return res.status(400).json({
        success: false, 
        message: "Make sure group id and "+ 
                "message id are provided"
      });
    }

    GetMsgReaders(msg_id, group_id, (result)=>{
      if(result.success === false){
        return res.status(400).json(result);
      }else{
        return res.status(201).json(result);
      }      
    });    
  });

  app.get("/group/:id/message", (req, res) => {

    let group_id = req.params.id;

    if(group_id === undefined || 
      isNaN(group_id)){
  
      /**
       * ensures group_id
       * feild is provided
       */

      return res.status(400).json({
        success: false, 
        message: "Make sure group id "+ 
                "is provided"
      });
  }    

    FindGroupMsg(req.params.id, req.session.username, (result)=>{
      if(result.success === false){
        return res.status(400).json(result);
      }else{
        return res.status(201).json(result);
      } 
    });
  });

}
