'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});

const _ = require('lodash'),
  stepfunctions = new AWS.StepFunctions({apiVersion: '2016-11-23'}),
  ACTIVITY_ARN = process.env.ACTIVITY_ARN || "arn:aws:states:eu-west-1:010154155802:activity:jpinsolle-xke-activity";


(function runActivity() {
  console.log('getActivityTask ...');

  // TODO
})();


function doProccess(data) {
  try {
    // TODO
  } catch(e) {
    return Promise.reject(e);
  }
}


function sendSuccess (token, result) {
  console.log('################ sendTaskSuccess ################');
  return stepfunctions.sendTaskSuccess({
    output: JSON.stringify(result),
    taskToken: token
  }).promise();
}

function sendFailure (token, err) {
  console.log('################ sendTaskFailure ################');
  return stepfunctions.sendTaskFailure({
    taskToken: token,
    cause: err.message,
    error: err.name || "ERROR_42"
  }).promise().then(d => {
    throw err;
  });
}

function handleError(err) {
  console.log('ERROR', err.stack || err.message);
}
