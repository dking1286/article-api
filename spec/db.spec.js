import test from 'tape';

import fs from 'fs';
import path from 'path';

import knex from '../db/knex';

import { setup } from './helpers/db_helpers';

test('author database table columns', (assert) => {
  setup(knex).then(() => {
    const expectedColumns = ['id', 'name', 'icon_url'];

    const columnChecks = expectedColumns.map((column) => {
      return knex.schema.hasColumn('author', column);
    });

    Promise.all(columnChecks)
      .then((results) => {
        const expected = true;
        const actual = results.every(result => result === true);

        assert.equal(expected, actual,
          'author table should have the correct columns');

        assert.end();
      });
  });
});

test('article database table columns', (assert) => {
  setup(knex).then(() => {
    const expectedColumns = [
      'id', 'title', 'body', 'media_url', 'published_at', 'likes_count', 'author_id',
    ];

    const columnChecks = expectedColumns.map((column) => {
      return knex.schema.hasColumn('article', column);
    });

    Promise.all(columnChecks)
      .then((results) => {
        const expected = true;
        const actual = results.every(result => result === true);

        assert.equal(expected, actual,
          'article table should contain the correct columns');

        assert.end();
      });
  });
});

test('article and author database correspondance', (assert) => {
  setup(knex).then(() => {
    const exampleDataPath = path.join(
      __dirname, '..', 'db', 'sample_data', 'sample_data.json');

    const exampleData = JSON.parse(fs.readFileSync(exampleDataPath));

    const correspondenceChecks = exampleData.map((article) => {
      return Promise.all([
        knex('author').where({ name: article.author.name }).select(),
        knex('article').where({ title: article.title }).select(),
      ]).then(([authorResult, articleResult]) => {
        const [{ id }] = authorResult;
        const [{ author_id }] = articleResult;

        return id === author_id;
      });
    });

    Promise.all(correspondenceChecks)
      .then((results) => {
        const expected = true;
        const actual = results.every(result => result === true);

        assert.equal(expected, actual,
          'article.author_id property should reference the correct author');

        assert.end();
      });
  });
});
