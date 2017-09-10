const getPlayers = require("../../../../api/players/get/index");

describe("Players API", function() {
    it("should return players", () => {
        const event = {};
        const context = {};
        const players = getPlayers.handler(event, context, (error, result) => {
            expect(result[0].username).toEqual("bobbyg603");
            expect(result[1].username).toEqual("lil_jake");
        });
    });
});