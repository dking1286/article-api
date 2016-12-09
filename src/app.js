import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import knex from '../db/knex';
import createArticlesController from './controllers/articles_controller';
import { notFound, forbidden } from './middleware/default_responses';
import { needOAuthToken } from './middleware/authentication';
import { validateNewArticleData } from './middleware/validation';

const app = express();
const articlesController = createArticlesController(knex);

app.use(cookieParser());
app.use(bodyParser.json());


app.get('/articles', needOAuthToken, (req, res) => {
  articlesController.getArticlesList()
    .then(articles => res.status(200).json(articles));
});

app.post('/articles', needOAuthToken, validateNewArticleData, (req, res) => {
  const { title, body, summary, author_id, media_url } = req.body;

  articlesController.createArticle({
    title, body, summary, author_id, media_url,
  })
    .then(newRecord => res.status(200).json(newRecord));
});

app.put('/articles', forbidden);

app.delete('/articles', forbidden);



app.get('/article/:id', needOAuthToken, (req, res) => {
  articlesController.getArticle(req.params.id)
    .then(article => res.status(200).json(article));
});

app.post('/article', forbidden);

app.put('/article', needOAuthToken, (req, res) => {

});

app.delete('/article', needOAuthToken, (req, res) => {

});




app.use(notFound);

export default app;
