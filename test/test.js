let chai = require('chai'),
    chaiHttp = require('chai-http');
let app = require("../server");


chai.use(chaiHttp);

let expect = chai.expect;

describe("POST request ", () => {

    let url = "127.0.0.1:8000";

    it(" should return status 200", (done) => {

        chai.request(url)
            .get("/")
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it(" should disallow unregister user", (done) => {
        let user = {
            username: "paul",
            password: "1234"
        };
        chai.request(url)
            .post("/api/user/signin")
            .send(user)
            .end(function(err, res) {
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal("Username or password must be alphabet or digit not less than 4 in length");
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });
});