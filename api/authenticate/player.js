'use strict';

const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');
const dynamoDb = new aws.DynamoDB.DocumentClient();

module.exports.player = (event, context, callback) => {

  const requestData = JSON.parse(event.body);

  if (!requestData.username || !requestData.password) {
    console.error("Validation Failed!");
    callback(new Error('Username and/or password was not specified.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      username: requestData.username,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the player.'));
      return;
    }

    if (result.Item.password == requestData.password) {
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
  });
};