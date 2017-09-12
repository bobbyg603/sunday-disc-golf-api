const postAuthenticate = require("../../../../api/authenticate/post/index");

describe("Authenticate API", function() {
    it("should return players", () => {
        const user = {
            username: "bobbyg603",
            password: "password"
        };
        const event = { user };
        const context = {};
        postAuthenticate.handler(event, context, (error, result) => {
            expect(result.success).toBe(true);
            expect(result.token).not.toBe(null);
        });
    });
});