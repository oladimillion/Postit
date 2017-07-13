const asserts = require('chai').assert;
const request = require('supertest');
const app = require('./server.js');

describe('Signup tests', () => {

  it('signup post url should be defined', (done) => {
    request(app).post('/api/user/signup').send().end((err, res) => {
      asserts.equal(res.statusCode, 200);
      done();
    });
  });

  it('should validate input parameters are  username,email and password', (done) => {
    let data = {'username':'gbenga_ps','password':'some password','email':'ioyetade@gmail.com'};
    request(app).post('/api/user/signup').send(data).end((err, res) => {
      asserts.equal(res.body, true);
      done();
    });
  });
});