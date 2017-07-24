import chai from "chai"

const asserts = chai.assert;
import request from 'supertest';

import app from "../server";

describe('Signup tests', () => {

  it('signup post url should be defined', (done) => {
    request(app).post('/api/user/signup').send().end((err, res) => {
      asserts.equal(res.statusCode, 200);
      done();
    });
  });

  it(`should validate input parameters are  username, email, 
    phone, password and cpassword`, (done) => {
    let data = {
      'username': 'gbenga_ps',
      'password': 'some password',
      'email': 'ioyetade@gmail.com',
      "phone": "08023181783"
    };
    request(app).post('/api/user/signup').send(data).end((err, res) => {
      asserts.equal(res.body, true);
      done();
    });
  });
});