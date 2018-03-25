'use strict';

const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');
const dynamoDb = new aws.DynamoDB.DocumentClient();
const bcrypt = require("bcryptjs");

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

    bcrypt.compare(requestData.password, result.Item.password)
      .then(result => {
        if (result) {
          const token = jwt.sign(requestData, process.env.JWT_SECRET, {
            expiresIn: 1440 // expires in 24 hours		
          });
          const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              message: 'Success',
            }),
          };
          callback(null, response);
        } else {
          const response = {
            statusCode: 401,
            headers: {
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
              message: 'Invalid password'
            }),
          };
          callback(null, response);
        }
      });
  });
};