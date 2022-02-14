// Initializes the `messages2` service on path `/messages-2`
const { Messages2 } = require('./messages2.class');
const createModel = require('../../models/messages2.model');
const hooks = require('./messages2.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/messages-2', new Messages2(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('messages-2');

  service.hooks(hooks);
};
