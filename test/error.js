"use strict";

const chai = require("chai");
const request = require('supertest');
// const request = require("request");
let expect = chai.expect;


describe("Postit GET and POST request test", () => {

    const app = require('../server');


    let serverInstance;


    describe('GET /', function() {
        beforeEach(function(done) {
            serverInstance = app.run(done);
        });

        afterEach(function(done) {
            serverInstance.close(done);
        });
        it('respond with json', function(done) {
            request(app)
                .get('/')
                .expect(200, done);
        });
    });

    describe("Login page", () => {

        let url = "http://localhost:8000/";

        it(" should return status 200", (done) => {

            request.get(url, (error, res) => {
                expect(res.statusCode).toEqual(200);
                done();
            });
        });

        let user = {
            username: "oladimillion",
            password: "1234"
        };

        it('should fail on POST', (done) => {
            request.post(url, user, (error, res) => {
                expect(res.statusCode).toEqual(404);
                done();
            });
        });
    });

    describe("POST request ", () => {

        it(" should return status 200", (done) => {

            let url = "http://localhost:8000/api/user/signin";

            let user = {
                username: " ",
                password: "1234"
            };

            request.post(url, user, (error, res, body) => {
                console.log(body);
                console.log(body.message);
                expect(res.statusCode).toEqual(200);
                done();
            });
        });


    });

});