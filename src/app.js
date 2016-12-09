import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { notFound, forbidden } from './middleware/default_responses';
import { needOAuthToken } from './middleware/authentication';

const app = express();


app.get('/articles', needOAuthToken, (req, res) => {
  res.status(200).send();
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




app.use((req, res) => {
  res.status(404).send('The requested resource was not found');
});

export default app;
