'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const dynamoItem = {};
  
  if (data.username) {
    dynamoItem.username = data.username;
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the player, invalid username.'));
    return;
  }

  if (data.password) {
    dynamoItem.password = data.password;
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the player, invalid password.'));
    return;
  }

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

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
