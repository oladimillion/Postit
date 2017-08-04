import db from "../models/db"
import bcrypt from "bcrypt-nodejs"

const Users = db.Users;

export function SignUp(req, res) {

	if (notValid(req)) {
		return res.status(400).json({
			success: false,
			message: "All fields are required!"
		})
	} else if (req.body.password !== req.body.cpassword) {
		return res.status(400).json({
			success: false,
			message: "Password do not match"
		})
	}


	Users.findAll({})
		.then(data => {
			return Users.create({
				userId: data.length + 1,
				username: req.body.username,
				phone: req.body.phone,
				email: req.body.email,
				password: req.body.password
			})
		})
		.then((user) => {
			return res.status(201).json({
				success: true,
				message: "Registration Successful"
			});
		})
		.catch((error) => {
			return res.status(400).json({
				success: false,
				message: error.errors[0].message
			});
		});
}

export function SignIn(req, res) {

	Users.findOne({
			where: {
				username: req.body.username,
			}
		})
		.then((data) => {
			if (data === null) {
				return res.status(400).json({
					success: false,
					message: "Please register before login"
				});
			} else {

				const validPassword = bcrypt.compareSync(req.body.password, data.password);

				if (validPassword) {
					req.session.userId = data.userId;

					return res.status(201).json({
						success: true,
						message: "Welcome"
					});

				} else {
					return res.status(400).json({
						success: false,
						message: "Invalid Password"
					})
				}
			}
		})
		.catch((error) => {
			return res.status(400).json({
				success: false,
				message: error.errors[0].message
			});
		});

}

function notValid(req) {

	const username = req.body.username;
	const phone = req.body.phone;
	const email = req.body.email;
	const password = req.body.password;

	if (username === null || phone === null ||
		email === null || password === null ||
		username === undefined || phone === undefined ||
		email === undefined || password === undefined) {
		return true;
	} else {
		return false;
	}
}