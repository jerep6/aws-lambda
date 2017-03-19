'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});

const _ = require('lodash'),
  stepfunctions = new AWS.StepFunctions({apiVersion: '2016-11-23'}),
  ACTIVITY_ARN = process.env.ACTIVITY_ARN || "arn:aws:states:eu-west-1:010154155802:activity:jpinsolle-test";


(function runActivity() {
  console.log('getActivityTask ...');

  stepfunctions.getActivityTask({
    activityArn: ACTIVITY_ARN,
    workerName: 'Worker_XKE'
  }).promise()  // SDK wait 60sec if not data
    .then(data => {
      if (data.taskToken) {
        console.log('Activity to run', JSON.stringify(data, null, 2));
        return doProccess(data)
        .then(sendSuccess.bind(null, data.taskToken))
        .catch(sendFailure.bind(null, data.taskToken));
      } else {
        console.log("No activity to run");
      }
    })
    .catch(handleError)
    .then(runActivity)
})();


function doProccess(data) {
  return Promise.resolve({ split: "ok" });
}


function sendSuccess (token, result) {
  return stepfunctions.sendTaskSuccess({
    output: JSON.stringify(result),
    taskToken: token
  }).promise();
}

function sendFailure (token, err) {
  return stepfunctions.sendTaskFailure({
    taskToken: token,
    cause: err.message,
    error: err.stack
  }).promise().then(() => {
      throw err
    });
}

function handleError(err) {
  console.log('ERROR', err.stack || err.message);
}
