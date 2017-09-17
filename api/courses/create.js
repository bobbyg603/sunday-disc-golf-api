'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const dynamoItem = {};
  
  if (data.courseName) {
    dynamoItem.courseName = data.courseName;
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the course, invalid courseName.'));
    return;
  }

  if (data.holes) {
    dynamoItem.holes = data.holes;
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the course, invalid holes.'));
    return;
  }

  if (data.street) {
    dynamoItem.street = data.street;
  }

  if (data.city) {
    dynamoItem.city = data.city;
  }

  if (data.state) {
    dynamoItem.state = data.state;
  }
  
  if (data.zip) {
    dynamoItem.zip = data.zip;
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
      callback(new Error('Couldn\'t create the course.'));
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
