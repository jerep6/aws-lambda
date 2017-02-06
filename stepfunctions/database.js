'use strict';
const _ = require('lodash');

exports.handler = (event, context) => {
  console.log(`Start database`, event);


  context.succeed({"status": "ok"});
};
