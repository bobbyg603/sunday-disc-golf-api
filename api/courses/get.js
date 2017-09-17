'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {

  const data = JSON.parse(event.body);
  let courseName = "";

  if(event.pathParameters) {
    courseName = event.pathParameters.courseName;
  } else if (data) {
    courseName = data.courseName;
  } else {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: 'No courseName provided',
      }),
    };
    callback(null, response);
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      courseName: courseName,
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