const { authenticate } = require('@feathersjs/authentication').hooks;
const checkPermissions = require('feathers-permissions');
const { setField } = require('feathers-authentication-hooks');
const processMessage = require('../../hooks/process-message');
const {iff  } = require('feathers-hooks-common')
const populateUser = require('../../hooks/populate-user');

const logger = require('../../hooks/logger');

const permissionCheck = require('../../hooks/permission-check');

module.exports = {
  before: {
    all: [authenticate('jwt'),logger()],
    find: [checkPermissions({
      roles:context=>{
        console.log(context.path);
        return ['admin'];
      },
      
      error: false
    }), 
    iff(context => !context.params.permitted,
      setField({
        from: 'params.user._id',
        as: 'params.query.userId'
      })
    ),
    permissionCheck()
  ],
    get: [],
    create: [processMessage()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populateUser()],
    find: [],
    get: [],
    create: [ ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
