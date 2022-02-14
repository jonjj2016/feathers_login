const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const messages2 = require('./messages2/messages2.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(messages);
  app.configure(messages2);
};
