"use strict";

// fetches and saves users credentials in the database
import {RegUser, FindOneUser} from "../model/model"; 

export default function UserRoutes (app) {

	app.post("/user/signin", (req, res) => {

		// signin route
		let userObj = {
			username: req.body.username,
			password: req.body.password
		};

		let re = /^([a-zA-Z]+[\d]*).{3,}$/;
		if (!re.test(userObj.username)) {		
			/* Username  must start with character and 
			* must be alphabet or alphanumeric 
			* not less than 4 in length
			*/

			return res.status(400).json({ success: false, 
				message: "Username  must " +
				"start with character and must be alphabet or alphanumeric "+
				"not less than 4 in length"});
		}

		re = /^([a-zA-Z0-9.!#$%'+=*"^&{|}~()`\\?/><,.]){4,}$/;
		if(!re.test(userObj.password)){
			/* Password must not be less than 
			* four in length, can contain digit, alphabet
			* or special characters
			*/
			return res.status(400).json({ success: false, 
				message: "Password must not be less than "+
				"four in length, can contain digit, alphabet "+
				"or special characters or all" });
		}

		FindOneUser(userObj, (result) => {
			// verifies user signin data
			if(result.success === false){
        return res.status(400).json(result);
      }else{
				req.session.username = userObj.username;
        return res.status(201).json(result);
      } 
		});
	});

	app.post("/user/signup", (req, res) => {

		if (req.body.password !== req.body.cpassword) {
			// makes sure user's password is entered correctly
			return res.status(400).json({ success: false, 
				message: "Password do not match" });
		}

		/* 
		* filters out user registration data before insertion into ehe datbase
		*/
		let userObj = {
			username: req.body.username,
			phone: req.body.phone,
			email: req.body.email,
			password: req.body.password
		};

		let re = /^([a-zA-Z]+[\d]*).{3,30}$/;
		if (!re.test(userObj.username)) {
			/* Username  must start with character and 
			* must be alphabet or alphanumeric 
			* not less than 4 in length
			*/

			return res.status(400).json({ success: false, 
				message: "Username  must "+
			"start with character and must be alphabet or alphanumeric "+
			"not less than 4 in length" });
		}

		re = /^([a-zA-Z0-9.!#$%'+=*"^&{|}~()`\\?/><,.]){4,30}$/;
		if(!re.test(userObj.password)){
			/* Password must not be less than 
			* four in length, can contain digit, alphabet
			* or special characters or all
			*/
			return res.status(400).json({ success: false, 
				message: "Password must not be less than "+
				"four in length, can contain digit, alphabet "+
				"or special characters or all"});
		}

		re = /^([\d]){6,20}$/;
		if(!re.test(userObj.phone)){
			/* Password must not be less than 
			* four in length, can contain digit, alphabet
			* or special characters or all
			*/
			return res.status(400).json({ success: false, 
				message: "Phone no must be digits only,"+
				" length should be between 6 and 20"});
		}

		re = new RegExp("^([A-Za-z0-9.!#$%'+=*\"^&{|}~()`\\?/><,.])"+
			"{2,}@[a-zA-Z0-9-]{2,}(?:\.[a-zA-Z0-9-]{2,})$");	
		if (!re.test(userObj.email)) {
			// verifies user's email
			return res.status(400).json({ success: false, 
				message: "Invalid email" });
		}

		RegUser(userObj, (result) => {
			// creates users account
			if(result.success === false){
        return res.status(400).json(result);
      }else{
        return res.status(201).json(result);
      } 
		});
	});
}