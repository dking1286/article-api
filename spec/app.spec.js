import test from 'tape';
import request from 'supertest';

import knex from '../db/knex';
import app from '../src/index';

function setup() {
  return new Promise((resolve, reject) => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => resolve())
    .catch(error => reject(error));
  });
}


test('articles route protected on GET request', (assert) => {
  setup().then(() => {
    request(app)
      .get('/articles')
      .end((error, response) => {
        const actual = response.status;
        const expected = 401;

        assert.equal(expected, actual,
          'Response should have status 401 when oAuth token not provided');

        assert.end();
      });
  })
  .catch(error => assert.end(error));
});

test('articles route protected on POST request', (assert) => {
  setup().then(() => {
    request(app)
      .post('/articles')
      .end((error, response) => {
        const actual = response.status;
        const expected = 401;

        assert.equal(expected, actual,
          'Response should have status 401 when oAuth token not provided');

        assert.end();
      });
  })
  .catch(error => assert.end(error));
});

test('articles route responds 403 on PUT request', (assert) => {
  setup().then(() => {
    request(app)
      .put('/articles')
      .end((error, response) => {
        const actual = response.status;
        const expected = 403;

        assert.equal(expected, actual,
          'PUT request should be forbidden to /articles route');

        assert.end();
      });
  })
  .catch(error => assert.end(error));
});

test('responds 403 on DELETE request', (assert) => {
  setup().then(() => {
    request(app)
      .delete('/articles')
      .end((error, response) => {
        const actual = response.status;
        const expected = 403;

        assert.equal(expected, actual,
          'PUT request should be forbidden to /articles route');

        assert.end();
      });
  })
  .catch(error => assert.end(error));
});


test('article route protected on GET request', (assert) => {
  assert.end();
});

test('article route protected on PUT request', (assert) => {
  assert.end();
});

test('article route protected on DELETE request', (assert) => {
  assert.end();
});

test('article route responds 403 on POST request', (assert) => {
  assert.end();
});


