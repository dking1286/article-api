import test from 'tape';

import app from '../src/index';

test('this is a basic test', (assert) => {
  console.log(process.env.NODE_ENV)
  assert.equal(1, 2);

  assert.end();
});

test('Closing server', (assert) => {
  app.server.close();
  assert.end();
});
