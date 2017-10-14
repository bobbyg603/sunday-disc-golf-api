'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// TODO BG DynamoDB expressions don't work
module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const dynamoExpressionBuilder = [];

  if (!event.pathParameters.username) {
    console.error('Validation Failed');
    callback(new Error('Invalid username in path.'));
    return;
  }

  if (!data.password
    && !data.firstName
    && !data.lastName
    && !data.email
    && !data.phone
    && !data.bio) {
      console.error('Validation Failed');
      callback(new Error('Couldn\'t update the player, no valid fields were provided.'));
      return;
    }

  if (data.password) {
    dynamoExpressionBuilder.push("password = " + data.password);
  }

  if (data.firstName) {
    dynamoExpressionBuilder.push("firstName = " + data.firstName);
  }

  if (data.lastName) {
    dynamoExpressionBuilder.push("lastName = " + data.lastName);
  }

  if (data.email) {
    dynamoExpressionBuilder.push("email = " + data.email);
  }
  
  if (data.phone) {
    dynamoExpressionBuilder.push("phone = " + data.phone);
  }

  if (data.bio) {
    dynamoExpressionBuilder.push("bio = " + data.bio);
  }

  dynamoExpressionBuilder.push("updatedAt = " + timestamp);

  const dynamoUpdateExpression = "SET " + dynamoExpressionBuilder.join(", ");

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      username: event.pathParameters.username,
    },
    UpdateExpression: dynamoUpdateExpression,
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
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};