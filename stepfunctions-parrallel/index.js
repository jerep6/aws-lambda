

module.exports.add = function (event, context) {
  console.log(JSON.stringify(event));

  const n1 = event.n1;
  const n2 = event.n2;
  const r = n1 + n2;

  context.succeed({result: r});
};

module.exports.sub = function (event, context) {
  console.log(JSON.stringify(event));

  const n1 = event.n1;
  const n2 = event.n2;
  const r = n1 - n2;

  context.succeed({result: r});
};