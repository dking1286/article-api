import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import knex from '../db/knex';
import createArticlesController from './controllers/articles_controller';
import { notFound, forbidden } from './middleware/default_responses';
import { needOAuthToken } from './middleware/authentication';
import {
  validateNewArticleData,
  validateUpdateArticleData,
} from './middleware/validation';

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

app.put('/article/:id', needOAuthToken, validateUpdateArticleData, (req, res) => {
  const { title, body, media_url, summary } = req.body;

  articlesController.updateArticle(req.params.id, {
    title, body, media_url, summary,
  })
    .then(article => res.status(200).json(article));
});

app.delete('/article/:id', needOAuthToken, (req, res) => {
  articlesController.deleteArticle(req.params.id)
    .then(() => res.status(200).send());
});


app.use(notFound);

export default app;
