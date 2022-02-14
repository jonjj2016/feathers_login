const assert = require('assert');
const app = require('../../src/app');

describe('\'messages2\' service', () => {
  it('registered the service', () => {
    const service = app.service('messages-2');

    assert.ok(service, 'Registered the service');
  });
});
