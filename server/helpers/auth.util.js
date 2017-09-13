'use strict';

// generating a random string in client state (e.g., a cookie) helps validate responses to additionally
// ensure that the request and response originated in the same browser. protects against csrf attacks.
exports.generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
