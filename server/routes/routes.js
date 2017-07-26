import express from "express";

const route = express.Router();

import {
	OneUser,
	AllGroups,
	usermessages
} from "../controllers/testctrl"

import {
	SignIn,
	SignUp
} from "../controllers/userctrl";

import {
	NewGroup,
} from "../controllers/groupctrl";

import {
	JoinGroup
} from "../controllers/usergroupsctrl.js"

import {
	PostMessage,
} from "../controllers/messagectrl";

import {
	GetGroupMessages
} from "../controllers/groupmessagectrl.js";




route.get("/test/oneuser", OneUser);
route.get("/test/:id/allgroups", AllGroups);
route.get("/test/:id/usermessages", usermessages);

route.post("/user/signin", SignIn);
route.post("/user/signup", SignUp);

// route.post("*", (req, res, next) => {

// 	/**
// 	 * makes sure user is logged
// 	 * in before accessing any resource
// 	 */

// 	if (!req.session.userId) {

// 		console.log('checkAuth: ' + req.url);

// 		return res.status(400).json({
// 			success: false,
// 			message: "Please login"
// 		});

// 	} else {
// 		next();
// 	}
// });


route.post("/group", NewGroup);
route.post("/group/:id/user", JoinGroup);
route.post("/group/:id/message", PostMessage);
route.get("/group/:id/message", GetGroupMessages);

export default route;