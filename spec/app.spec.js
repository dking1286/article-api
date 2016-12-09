import test from 'tape';
import request from 'supertest';

import knex from '../db/knex';
import app from '../src/index';
import { setup } from './helpers/db_helpers';

const AUTH_TOKEN = '54V8pF622M63y6RMVZy8bmS8sGmwv4r83RCuP6Fq';

test('articles route protected on GET request', (assert) => {
  setup(knex).then(() => {
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

test('articles route GET request responds with JSON', (assert) => {
  setup(knex).then(() => {
    request(app)
      .get('/articles')
      .set('Cookie', [`Auth-token=${AUTH_TOKEN}`])
      .expect(200)
      .end((error, response) => {
        if (error) return assert.end(error);

        const expected = 'application/json; charset=utf-8';
        const actual = response.get('Content-type');

        assert.equal(actual, expected,
          'Content-type should be JSON');

        assert.end();
      });
  });
});

test('articles route GET request lists all articles', (assert) => {
  setup(knex).then(() => {
    request(app)
      .get('/articles')
      .set('Cookie', [`Auth-token=${AUTH_TOKEN}`])
      .expect(200)
      .end((error, response) => {
        if (error) return assert.end(error);

        const actual = response.body.length;
        const expected = 10;

        assert.equal(actual, expected,
          'Response should contain 10 articles');

        assert.end();
      });
  });
});

test('articles route GET request responds with correct data format', (assert) => {
  setup(knex).then(() => {
    request(app)
      .get('/articles')
      .set('Cookie', [`Auth-token=${AUTH_TOKEN}`])
      .expect(200)
      .end((error, response) => {
        if (error) return assert.end(error);

        const expectedProperties = [
          'id', 'title', 'summary', 'media_url',
          'published_at', 'likes_count', 'author',
        ];

        const expectedAuthorProperties = ['name', 'icon_url'];

        const articles = response.body;

        articles.forEach((article) => {
          expectedProperties.forEach((property) => {
            assert.notEqual(article[property], undefined,
              `Article should have property ${property}`);
          });

          expectedAuthorProperties.forEach((property) => {
            assert.notEqual(article.author[property], undefined,
              `Article author property should have sub-property ${property}`);
          });
        });

        assert.end();
      });
  });
});

test('articles route protected on POST request', (assert) => {
  setup(knex).then(() => {
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

test('articles route POST request requires title, body, summary, author_id', (assert) => {
  setup(knex).then(() => {
    request(app)
      .post('/articles')
      .set('Cookie', [`Auth-token=${AUTH_TOKEN}`])
      .expect(400)
      .end((error, response) => {
        if (error) return assert.end(error);

        assert.end();
      });
  });
});

test('articles route POST request creates new article', (assert) => {
  setup(knex).then(() => {
    const newArticle = {
      title: 'My new article',
      body: 'This is a fantastic article',
      summary: 'A fantastic article',
      author_id: 1,
    };

    request(app)
      .post('/articles')
      .set('Cookie', [`Auth-token=${AUTH_TOKEN}`])
      .send(newArticle)
      .expect(200)
      .end((error, response) => {
        if (error) return assert.end(error);
        
        knex('article')
          .where(newArticle)
          .select()
          .then((results) => {
            const actual = results.length;
            const expected = 1;

            assert.equal(actual, expected,
              'Newly created article should match data sent with POST request');
            
            assert.end();
          });
      });
  });
});

test('articles route responds 403 on PUT request', (assert) => {
  setup(knex).then(() => {
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

test('articles route responds 403 on DELETE request', (assert) => {
  setup(knex).then(() => {
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
  setup(knex).then(() => {
    request(app)
      .get('/article/1')
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

test('article route GET request responds with JSON', (assert) => {
  setup(knex).then(() => {
    request(app)
      .get('/article/1')
      .set('Cookie', [`Auth-token=${AUTH_TOKEN}`])
      .expect(200)
      .end((error, response) => {
        if (error) return assert.end(error);

        const actual = response.get('Content-type');
        const expected = 'application/json; charset=utf-8';

        assert.equal(actual, expected,
          'Get /article/1 should respond with JSON');
        
        assert.end();
      });
  });
});

test('article route GET request data format', (assert) => {
  setup(knex).then(() => {
    request(app)
      .get('/article/1')
      .set('Cookie', [`Auth-token=${AUTH_TOKEN}`])
      .expect(200)
      .end((error, response) => {
        if (error) return assert.end(error);

        const expectedProperties = [
          'id', 'title', 'body', 'media_url',
          'published_at', 'likes_count', 'author',
        ];

        const expectedAuthorProperties = ['name', 'icon_url'];

        const article = response.body;

        expectedProperties.forEach((property) => {
          assert.notEqual(article[property], undefined,
            `Article should have property ${property}`);
        });

        expectedAuthorProperties.forEach((property) => {
          assert.notEqual(article.author[property], undefined,
            `Article author property should have sub-property ${property}`);
        });
    
        assert.end();
      });
  });
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


