'use strict';

exports.handler = (event, context) => {
  console.log(`Start Lambda2`, event);


  context.succeed({"result": "l2"});
};
