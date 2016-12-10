const fs = require('fs');
const path = require('path');

const request = require('request');

const ARTICLES_PATH = 'https://medcircle-coding-project.s3.amazonaws.com/api/articles.json';
const ARTICLE_PATH = id => `https://medcircle-coding-project.s3.amazonaws.com/api/articles/${id}.json`;

function getJSON(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error) return reject(error);

      return resolve(JSON.parse(body));
    });
  });
}

getJSON(ARTICLES_PATH)
  .then((articles) => {
    const writePath = path.join(
      __dirname, 'downloaded_medcircle_data', 'articles', 'articles.json'
    );

    fs.writeFileSync(writePath, JSON.stringify(articles, null, 2));

    return articles;
  })
  .then((articles) => {
    const detailRequests = articles.map((article) => {
      return getJSON(ARTICLE_PATH(article.id));
    })

    return Promise.all(detailRequests);
  })
  .then((articleDetails) => {
    articleDetails.forEach((article) => {
      const writePath = path.join(
        __dirname, 'downloaded_medcircle_data', 'article', `${article.id}.json`
      )

      fs.writeFileSync(writePath, JSON.stringify(article, null, 2));
    });

    return articleDetails;
  })
  .then((articleDetails) => {
    const readPath = path.join(
      __dirname, 'downloaded_medcircle_data', 'articles', 'articles.json'
    );

    const articles = JSON.parse(fs.readFileSync(readPath));

    const articlesWithBodyAndSummary = articleDetails.map((articleWithBody) => {
      const { summary } = articles.find(article =>
        article.id === articleWithBody.id);
      
      return Object.assign({}, articleWithBody, { summary });
    });

    const writePath = path.join(
      __dirname, 'sample_data', 'sample_data.json'
    )

    fs.writeFileSync(
      writePath, JSON.stringify(articlesWithBodyAndSummary, null, 2));
  })
// function getArticles() {
//   return getJSON(ARTICLES_PATH)
//     .then(articles => getArticleBodies(articles));
//   // return new Promise((resolve, reject) => {
//   //   request.get(ARTICLES_PATH, (error, response, body) => {
//   //     const requests = JSON.parse(body)
//   //       .map(articleSummary => articleSummary.id)
//   //       .map(id => new Promise((res, rej) => {
//   //         request.get(ARTICLE_PATH(id), (err, resp, bod) => {
//   //           res(JSON.parse(bod));
//   //         });
//   //       }));
      
//   //     Promise.all(requests).then(resolve);
//   //   });
//   // });
// }

// function getArticleBodies(articles) {
//   const bodyRequests = articles.map((article) => {
//     return getJSON(ARTICLE_PATH(article.id));
//   });

//   return Promise.all(bodyRequests)
//     .then((articlesWithBody) => {
//       return articlesWithBody.map((articleWithBody) => {
//         const corresponding = articles.find(article => 
//           article.id === articleWithBody.id)
        
//         const { summary } = corresponding;

//         return Object.assign({}, articleWithBody, summary);
//       });
//     });
// }

// 

// function writeToSampleData(data, filename) {
//   const dataPath = path.join(__dirname, 'sample_data', filename);
//   fs.writeFileSync(
//     dataPath,
//     JSON.stringify(data));

//   return data;
// }

// function separateIntoTables(articles) {
//   const authorsTable = articles
//     .map(article => article.author)
//     .filter((author, i, authors) => {
//       const isRejected = authors
//         .slice(0, i)
//         .map(auth => auth.name)
//         .includes(author.name);

//       return !isRejected;
//     })
//     .map((author, i) => Object.assign(author, { id: i + 1 }));

//   const articlesTable = articles
//     .map((article) => {
//       const { id, title, body, media_url, published_at, likes_count, summary } = article;
//       const author_id = authorsTable.reduce((current, author) =>
//         author.name === article.author.name ? author.id : current, null);

//       return {
//         id, title, body, media_url, published_at, likes_count, author_id, summary,
//       };
//     });
//   return { authorsTable, articlesTable };
// }

// getArticles()
//   .then(articles => writeToSampleData(articles, 'sample_data.json'))
//   // .then(articles => separateIntoTables(articles))
//   // .then(({ authorsTable, articlesTable }) => {
//   //   writeToSampleData(authorsTable, 'sample_authors.json');
//   //   writeToSampleData(articlesTable, 'sample_articles.json');
//   // });
