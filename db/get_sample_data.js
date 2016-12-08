const fs = require('fs');
const path = require('path');

const request = require('request');

const ARTICLES_PATH = 'https://medcircle-coding-project.s3.amazonaws.com/api/articles.json';
const ARTICLE_PATH = id => `https://medcircle-coding-project.s3.amazonaws.com/api/articles/${id}.json`;

function getAllSamples() {
  return new Promise((resolve, reject) => {
    request.get(ARTICLES_PATH, (error, response, body) => {
      const requests = JSON.parse(body)
        .map(articleSummary => articleSummary.id)
        .map(id => new Promise((res, rej) => {
          request.get(ARTICLE_PATH(id), (err, resp, bod) => {
            res(JSON.parse(bod));
          });
        }));
      
      Promise.all(requests).then(resolve);
    });
  });
}

function writeToSampleData(data, filename) {
  const dataPath = path.join(__dirname, 'sample_data', filename);
  fs.writeFileSync(
    dataPath,
    JSON.stringify(data));

  return data;
}

function separateIntoTables(articles) {
  const authorsTable = articles
    .map(article => article.author)
    .filter((author, i, authors) => {
      const isRejected = authors
        .slice(0, i)
        .map(auth => auth.name)
        .includes(author.name);

      return !isRejected;
    })
    .map((author, i) => Object.assign(author, { id: i + 1 }));

  const articlesTable = articles
    .map(article => {
      const {id, title, body, media_url, published_at, likes_count} = article;
      const author_id = authorsTable.reduce((current, author) =>
        author.name === article.author.name ? author.id : current, null);

      return { 
        id, title, body, media_url, published_at, likes_count, author_id,
      };
    });
  return { authorsTable, articlesTable };
}

getAllSamples()
  .then(articles => writeToSampleData(articles, 'sample_data.json'))
  .then(articles => separateIntoTables(articles))
  .then(({ authorsTable, articlesTable }) => {
    writeToSampleData(authorsTable, 'sample_authors.json');
    writeToSampleData(articlesTable, 'sample_articles.json');
  });
