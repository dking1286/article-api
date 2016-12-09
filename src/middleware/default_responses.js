export function forbidden(req, res, next) {
  return res.status(403).send();
}

export function notFound(req, res, next) {
  return res.status(404).send();
}
