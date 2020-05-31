let expect = require("chai").expect;
let request = require("request");

describe("Status", function () {
  describe("Users page", function () {
    it("status", function (done) {
      request("http://localhost:8080/api", function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
});
