module.exports.handler = function (event, context) {
  console.log("Event", JSON.stringify(event));

  switch(event.type) {
    case 'timeout':
      setTimeout(() => context.succeed("OK"), 3000); // Assume that Lambda timeout is 2sec
      break;

    case 'generic-error':
      context.fail(new Error ("Generic message"));
      break;

    case 'custom-error':
      context.fail(new MyCustomError ("Custom message", 18));
      break;

    case 'custom-error-object':
      context.fail(JSON.stringify({ "msg" : "Custom message", "lastOffset": 18}));
      break;

    case 'unhandled':
      const a = undeclaredVariable + 1;
      context.succeed(a);
      break;

    case 'permission': // this lambda doesn't have permission to read S3
      const s3 = new (require('aws-sdk')).S3({apiVersion: '2006-03-01'});
      s3.listBuckets().promise().then(context.succeed).catch(context.fail);
      break;

    default:
      context.succeed("OK");
  }

};

class MyCustomError extends Error {
  constructor(message, offset) {
    super(message);
    this.message = message;
    this.name = 'MyCustomError';
    this.lastOffset = offset;
  }
}