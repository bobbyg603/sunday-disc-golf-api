'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();

  if (!event.pathParameters.username) {
    console.error('Validation Failed');
    callback(new Error('Invalid username in path.'));
    return;
  }

  if (!event.username || !event.password) {
    console.error('Validation Failed');
    callback(new Error('Invalid body.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      username: event.pathParameters.username,
    },
    ExpressionAttributeNames: {
      '#user_password': 'password'
    },
    ExpressionAttributeValues: {
      ':password': event.password,
      ':updatedAt': timestamp
    },
    UpdateExpression: 'SET #user_password = :password, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update the player.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};