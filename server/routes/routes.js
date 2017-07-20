import express from "express";

const app = express.Router();

import {
	OneUser,
	AllGroups
} from "../controllers/testctrl"

import {
	SignIn,
	SignUp
} from "../controllers/userctrl";

import {
	NewGroup
} from "../controllers/groupctrl";

import {
	PostMessage
} from "../controllers/messagectrl";

import {
	JoinGroup
} from "../controllers/usergroupsctrl.js";

export function api() {

	app.get("/test/oneuser", OneUser);
	app.get("/test/allgroups", AllGroups);

	app.post("/user/signin", SignIn);
	app.post("/user/signup", SignUp);

	app.post("*", (req, res, next) => {

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

		} else {
			next();
		}
	});

	app.post("/group", NewGroup);
	app.post("/group/:id/user", JoinGroup);
	app.post("/group/:id/message", PostMessage);

	return app;
}