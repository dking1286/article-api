const path = require('path');
const fs = require('fs');

const databaseUrls = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'db/database_urls.json')));

module.exports = {
  test: {
    client: 'pg',
    connection: databaseUrls.test,
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db/seeds/test'),
    },
  },

  development: {
    client: 'pg',
    connection: databaseUrls.development,
    migrations: {
      directory: path.join(__dirname, 'db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'db/seeds/development'),
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
