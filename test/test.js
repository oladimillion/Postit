let chai = require('chai'),
    chaiHttp = require('chai-http');


chai.use(chaiHttp);

let expect = chai.expect;

describe("POST request ", () => {

    let url = "127.0.0.1:3000";

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
            username: "112paul",
            password: "1234"
        };
        chai.request(url)
            .post("/api/user/signin")
            .send(user)
            .end(function(err, res) {
                expect(res.body.success).to.equal(false);
                expect(res.body.message).to.equal("Username must " +
				"start with character and must be alphabet or alphanumeric");
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });
});