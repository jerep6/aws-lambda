module.exports.handler = function (event, context) {
  console.log("Event", JSON.stringify(event));

  switch(event.type) {
    case 'custom-error1':
      context.fail(new MyCustomError ('MyCustomError1', "MSG 1", 18));
      break;

    case 'custom-error2':
      context.fail(new MyCustomError ('MyCustomError2', "MSG2", 42));
      break;

    default:
      context.succeed("OK");
  }

};

class MyCustomError extends Error {
  constructor(type, message, offset) {
    super(message);
    this.message = message;
    this.name = type;
    this.lastOffset = offset;
  }
}