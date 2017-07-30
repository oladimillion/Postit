import chai from "chai"

const asserts = chai.assert;
import supertest from 'supertest';

import app from "../server";
// import express from "../server";

const request = supertest(app);

describe('Signup route tests', () => {

	it('should return status code of 400', (done) => {
		request.post('/api/user/signup').send().end((err, res) => {
			asserts.equal(res.statusCode, 400);
			done();
		});
	});

	it(`should respond with "Password do not match"`, (done) => {
		const data = {
			'username': 'username',
			'password': '123456',
			'email': 'uusername@greenhouse.io',
			"phone": "08023181783",
			"password": "12345",
			"cpassword": "1234"
		};
		request.post('/api/user/signup').send(data).end((err, res) => {
			const result = JSON.parse(res.text);
			asserts.equal(result.success, false);
			asserts.equal(res.statusCode, 201);
			asserts.equal(result.message, "Password do not match");
			done();
		});
	});
});

describe('Signin route tests', () => {

	it('should respond with status code of 400', (done) => {
		request.post('/api/user/signin').send().end((err, res) => {
			asserts.equal(res.statusCode, 400);
			done();
		});
	});

	it(`should respond with "Please register before login"`, (done) => {
		const data = {
			'username': 'username',
			'password': '1234',
		};
		request.post('/api/user/signin').send(data).end((err, res) => {
			let result = JSON.parse(res.text);
			asserts.equal(result.success, false);
			asserts.equal(res.statusCode, 400);
			asserts.equal(result.message, "Please register before login");
			done();
		});
	});
});

describe('Group creation route tests', () => {

	it('should respond with status code of 400', (done) => {
		request.post('/api/group').send().end((err, res) => {
			asserts.equal(res.statusCode, 400);
			done();
		});
	});

	it(`should respond with "Please provide valid group name"`, (done) => {
		request.post('/api/group').send().end((err, res) => {
			const result = JSON.parse(res.text);
			asserts.equal(result.success, false);
			asserts.equal(res.statusCode, 400);
			asserts.equal(result.message, "Please provide valid group name");
			done();
		});
	});
});

describe('Add users to group route tests', () => {

	it('should respond with status code of 400', (done) => {
		request.post('/api/group/1/user').send().end((err, res) => {
			asserts.equal(res.statusCode, 400);
			done();
		});
	});

	it(`should respond with "Please provide valid user id"`, (done) => {

		request.post('/api/group/1/user').send().end((err, res) => {
			const result = JSON.parse(res.text);
			asserts.equal(result.success, false);
			asserts.equal(res.statusCode, 400);
			asserts.equal(result.message, "Please provide valid user id");
			done();
		});
	});
});

describe('Send group message route tests', () => {

	it('should respond with status code of 400', (done) => {
		request.post('/api/group/1/message').send().end((err, res) => {
			asserts.equal(res.statusCode, 400);
			done();
		});
	});

	it(`should respond with "Message field cannot be empty"`, (done) => {

		request.post('/api/group/1/message').send().end((err, res) => {
			const result = JSON.parse(res.text);
			asserts.equal(result.success, false);
			asserts.equal(res.statusCode, 400);
			asserts.equal(result.message, "Message field cannot be empty");
			done();
		});
	});
});

describe('Retrieve group message route tests', () => {

	it('should respond with status code of 400', (done) => {
		request.get('/api/group/1/message').send().end((err, res) => {
			asserts.equal(res.statusCode, 400);
			done();
		});
	});

	it(`should respond with "Please login"`, (done) => {

		request.get('/api/group/1/message').send().end((err, res) => {
			const result = JSON.parse(res.text);
			asserts.equal(result.success, false);
			asserts.equal(res.statusCode, 400);
			asserts.equal(result.message, "Please login");
			done();
		});
	});
});