'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {

  const data = JSON.parse(event.body);
  let name = "";

  if(event.pathParameters) {
    name = event.pathParameters.name;
  } else if (data) {
    name = data.name;
  } else {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'No name provided',
      }),
    };
    callback(null, response);
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      name: name,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the course.'));
      return;
    }
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};