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