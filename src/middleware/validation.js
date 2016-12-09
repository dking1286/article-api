export function validateNewArticleData(req, res, next) {
  const expectedProperties = ['title', 'body', 'summary', 'author_id'];

  const valid = expectedProperties.reduce((curr, property) => {
    return curr && req.body[property] !== undefined;
  }, true);

  if (!valid) {
    const errorMessage = 'Article creation requires title, body, summary, author_id';
    return res.status(400).send(errorMessage);
  }

  return next();
}

export function validateUpdateArticleData(req, res, next) {
  const allowedProperties = ['title', 'summary', 'body', 'media_url'];

  const valid = Object.keys(req.body).every(key => {
    return allowedProperties.includes(key);
  });

  if (!valid) {
    const errorMessage = 'Article update data can only include title, body, summary, media_url';
    return res.status(400).send(errorMessage);
  }

  return next();
}