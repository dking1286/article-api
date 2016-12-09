import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import knex from '../db/knex';
import createArticlesController from './controllers/articles_controller';
import { notFound, forbidden } from './middleware/default_responses';
import { needOAuthToken } from './middleware/authentication';

const app = express();
const articlesController = createArticlesController(knex);

app.use(cookieParser());


app.get('/articles', needOAuthToken, (req, res) => {
  articlesController.getArticlesList()
    .then((articles) => res.status(200).json(articles));
});

app.post('/articles', needOAuthToken, (req, res) => {
  res.status(200).send();
});

app.put('/articles', forbidden);

app.delete('/articles', forbidden);



app.get('/article', needOAuthToken, (req, res) => {
  
});

app.post('/article', forbidden);

app.put('/article', needOAuthToken, (req, res) => {

});

app.delete('/article', needOAuthToken, (req, res) => {

});




app.use(notFound);

export default app;
