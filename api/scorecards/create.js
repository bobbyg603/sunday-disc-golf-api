'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// {
//    id: string,
//    course: {},
//    scores: [{
//     players: [],
//     scores: [{
//      hole: string,
//      score: number
//     }]
//    }]     
// }

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const dynamoItem = {};
  
  console.log(timestamp);
  dynamoItem.id = timestamp;

  if (data.course) {
    dynamoItem.course = data.course;
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the scorecard, invalid course.'));
    return;
  }

  if (data.scores) {
    dynamoItem.scores = data.scores;
  } else {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the scorecard, invalid scores.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: dynamoItem
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the scorecard.'));
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
