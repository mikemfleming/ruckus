'use strict';

exports.add = (req, res) => {
  console.log('made it to ADD', req.body);
  res.end()
};
