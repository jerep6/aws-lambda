'use strict';

exports.handler = (event, context) => {
  console.log(`Start Lambda1`, event);


  context.succeed({"result": "l1"});
};
