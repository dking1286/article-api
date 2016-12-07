import app from './app';
import knex from '../db/knex';

const PORT = 3000 || process.env.PORT;

// app.listen returns the underlying http server instance.
// Assign it to app.server so that it can be explicitly
// closed once testing is done.
app.server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
