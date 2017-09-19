'use strict';

module.exports = (req, res) => {
  // figure out what the message says
  const message = req.body.event.text;

  console.log(`message ${message}`);
  res.end();
};

// if it contains some kind of trigger

  // do something

// else

  // ignore it
