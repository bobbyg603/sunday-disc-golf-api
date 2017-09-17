'use strict';

const aws = require('aws-sdk');
const lambda = new aws.Lambda({
  region: process.env.PLAYERS_LAMBDA_FN_REGION
});
const jwt = require('jsonwebtoken');

module.exports.player = (event, context, callback) => {

  const requestData = JSON.parse(event.body);

  if (!requestData.username || !requestData.password) {
    console.error("Validation Failed!");
    callback(new Error('Username and/or password was not specified.'));
    return;
  }
  lambda.invoke({
    FunctionName: process.env.PLAYERS_LAMBDA_FN_NAME,
    Payload: JSON.stringify(event, null, 2)
  }, function (error, lambdaData) {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t authenticate the player.'));
      return;
    }
    if (lambdaData.Payload) {
      const lambdaResponseBody = JSON.parse(JSON.parse(lambdaData.Payload).body)
      if (lambdaResponseBody.password == requestData.password) {
        const token = jwt.sign(requestData, process.env.JWT_SECRET, {		
          expiresIn: 1440 // expires in 24 hours		
        });
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({
            success: true,
            message: '',
            token: token
          }),
        };
        callback(null, response);
      } else {
        const response = {
          statusCode: 403,
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({
            success: false,
            message: 'Invalid password',
            input: requestData,
          }),
        };
        callback(null, response);
      }
    }
  });
};