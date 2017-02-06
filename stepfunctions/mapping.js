'use strict';
const _ = require('lodash');

exports.handler = (event, context) => {
  const rawMessages = event.messages;
  console.log(`Start mapping`, {count: rawMessages.length});

  // No message
  if(rawMessages.length === 0) {
    context.succeed("No message to treat");
  }

  const errors = _.filter(rawMessages, msg => {
    if(!msg["hotel_id"]) { return true; }
    else if(!msg["nr_rooms"] || parseInt(msg["nr_rooms"]) <= 0) { return true; }
    else if(!msg["price"] || parseInt(msg["price"]) <= 0) { return true; }
  });

  const convertedMessage = _.map(_.difference(rawMessages, errors), msg => {
    return {
      "id": msg["hotel_id"],
      "name": msg["name"],
      "price": parseFloat(msg["price"]),
      "url": "http://www.booking.com",
      "location": {
        "latitude": msg.location.latitude,
        "longitude": _.get(msg, "location.longitude"),
        "formated_address": `${msg.address} ${msg.zip} ${msg.city}`,
      },
      "rooms": msg["nr_rooms"]
    }
  });

  context.succeed({"success": convertedMessage, error: errors});
};
