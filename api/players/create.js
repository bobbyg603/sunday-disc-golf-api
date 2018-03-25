'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const dynamoItem = {};

  if (!data.username) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the player, invalid username.'));
    return;
  }

  if (!data.password) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the player, invalid password.'));
    return;

  }

  bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(data.password, salt))
    .then(hashedPassword => {
      dynamoItem.username = data.username;
      dynamoItem.password = hashedPassword;

      if (data.firstName) {
        dynamoItem.firstName = data.firstName;
      }

      if (data.lastName) {
        dynamoItem.lastName = data.lastName;
      }

      if (data.email) {
        dynamoItem.email = data.email;
      }

      if (data.phone) {
        dynamoItem.phone = data.phone;
      }

      dynamoItem.updatedAt = timestamp;
      dynamoItem.createdAt = timestamp;

      const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: dynamoItem
      };

      dynamoDb.put(params, (error) => {
        if (error) {
          console.error(error);
          callback(new Error('Couldn\'t create the player.'));
          return;
        }

        delete params.Item.password;
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify(params.Item),
        };
        callback(null, response);
      });
    })
    .catch(error => {
      console.error(error);
      const response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: "Internal Server Error",
      };
      callback(null, response);
    });
};
