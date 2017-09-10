module.exports.handler = (event, context, callback) => {
    
    const players = [];
    const bobby = createPlayer("Bobby", "Galli", "bobbyg603@gmail.com", "6037482915", "best ever", "bobbyg603", "password");
    const jake = createPlayer("Jake", "Poirier", "jakeyp@gmail.com", "9999999999", "also best ever", "lil_jake", "password");
    players.push(bobby);
    players.push(jake);

    callback(null, players);
};

function createPlayer(firstName, lastName, email, phone, bio, username, password) {
    return {
        firstName,
        lastName,
        email,
        phone,
        bio,
        username,
        password
    }
}