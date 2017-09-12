const jwt = require("jsonwebtoken");

module.exports.handler = (event, context, callback) => {

    const secret = "todo bg";
    const user = event.user;
    const token = jwt.sign(user, secret, {
        expiresIn: 1440 // expires in 24 hours
    });

    callback(null, {
        success: true,
        message: "",
        token: token
    });
};