'use strict';

const sqs = new (require('aws-sdk').SQS)({apiVersion: '2012-11-05'});

const OutputSQS = process.env.OutputSQS;

exports.hello = (event, context, callback) => {
  console.log(`Start handler ${process.env.NODE_ENV} with event`, event);

  sqs.sendMessage({
    MessageBody: JSON.stringify(event),
    QueueUrl: OutputSQS
  }).promise()
  .then(() => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      })
    };
  })
  .then(context.succeed)
  .catch(context.fail)
};
