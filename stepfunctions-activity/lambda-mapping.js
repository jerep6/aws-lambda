'use strict';
const _ = require('lodash');

exports.handler = (event, context) => {
  const rawMessages = event.messages;
  console.log(`Start mapping`);

  // No message
  if(_.isEmpty(event)) {
    context.fail(new NoData("Event is empty"));
  }


  const convertedPerson = {
    "id": event.p_id,
    "identity": {
      firstName: event.firstName,
      lasName: event.lastName,
    },
    "address": {
      "number": event.number,
      "street": event.street,
      "postalCode": event.postal,
      "city": event.city,
      "formated_address": `${event.number} ${event.street} ${event.postal} ${event.city}`,
    }
  };

  context.succeed({"person": convertedPerson});
};


class NoData extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'NoData';
  }
}