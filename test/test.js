import chai from "chai"

const asserts = chai.assert;
import request from 'supertest';

import app from '../server';

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