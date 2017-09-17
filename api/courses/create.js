'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const dynamoItem = {};

  if (data.name) {
    dynamoItem.name = data.name;
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the course, invalid name.'));
    return;
  }

  if (data.holes) {
    dynamoItem.holes = [];
    data.holes.forEach(hole => {
      const holeBuilder = {};
      if (hole.number && hole.number != "") {
        holeBuilder.number = hole.number;
      } else {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t create the course, hole with invalid number.'));
        return;
      }

      if (hole.par && hole.par != "") {
        holeBuilder.par = hole.par;
      } else {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t create the course, hole with invalid par.'));
        return;
      }

      if (hole.distance && hole.distance != "") {
        holeBuilder.distance = hole.distance;
      }

      if (hole.elevation && hole.elevation != "") {
        holeBuilder.elevation = hole.elevation;
      }

      if (hole.description && hole.description != "") {
        holeBuilder.description = hole.description;
      }

      dynamoItem.holes.push(holeBuilder);
    })
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the course, invalid holes.'));
    return;
  }

  if (data.street && data.street != "") {
    dynamoItem.street = data.street;
  }

  if (data.city && data.street != "") {
    dynamoItem.city = data.city;
  }

  if (data.state && data.street != "") {
    dynamoItem.state = data.state;
  }

  if (data.zip && data.street != "") {
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
