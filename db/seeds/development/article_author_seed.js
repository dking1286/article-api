const path = require('path');
const fs = require('fs');

exports.seed = function(knex, Promise) {
  const exampleDataPath = path.join(
    __dirname, '..', '..', 'sample_data', 'sample_data.json');

  const exampleData = JSON.parse(fs.readFileSync(exampleDataPath));

  return knex('author').del()
    .then(() => knex('article').del())
    .then(() => Promise.all(
      exampleData.map(article => insertAuthorAndArticle(knex, article))
    ));
};

function insertAuthorAndArticle(knex, article) {
  const { title, body, media_url, likes_count, author, summary } = article;
  const { name, icon_url } = author;

  return knex('author').insert({ name, icon_url })
    .then(() => knex('author').select('id').where({ name }))
    .then(([{ id }]) => {
      return knex('article').insert({
        title, body, media_url, likes_count, summary, author_id: id,
      });
    });
}
