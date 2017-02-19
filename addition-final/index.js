'use strict';


exports.handler = (event, context) => {

  const nb1 = event.nb1;
  const nb2 = event.nb2;
  const result = nb1 + nb2;

  context.succeed({result: result});
};
