'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  if (!event.username) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the player, invalid username.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      username: event.username,
      password: event.password,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
  
  dynamoDb.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the todo item.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
