export function needOAuthToken(req, res, next) {
  const expectedToken = '54V8pF622M63y6RMVZy8bmS8sGmwv4r83RCuP6Fq';
  const actualToken = req.cookies['Auth-token'];

  console.log(expectedToken, actualToken);

  if (expectedToken !== actualToken) {
    return res.status(401).send('Authentication failed');
  }

  return next();
}
