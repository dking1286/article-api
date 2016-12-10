# article-api
A RESTful API that allows users to interact with an article database

## Getting Started
After cloning the repository to your local machine, install the dependencies:
```bash
npm install
```

## Database Setup
The app currently supports Postgres databases.
In order for the app to connect to the database, create a file called
`database_urls.json`, and place it inside the `db` directory. In this
file, create a JSON object with the keys `development` and `test`
whose values are the urls of your development and test databases.
For example:
```json
// db/database_urls.json

{
  "development": "postgres://username:password@localhost/databasename",
  "test": "postgres://username:password@localhost/databasename"
}
```
Obviously, "username", "password", and "databasename" should be replaced with your actual username, password, and the name of your database.

If you don't have the `knex` module installed on your system,
install it globally:
```bash
npm install -g knex
```

Now, we can create the tables in our development and test databases:
```bash
knex migration:latest --env development
knex migration:latest --env test
```

And we can insert the seed data into the development database:
```bash
knex seed:run
```

## Development
The app's source files must be transpiled using Babel. To run the
transpilation process:
```bash
npm run build:watch
```

This process will watch for changes in the `src` directory and automatically update the `dist`
directory.

To run the server in development mode:
```bash
npm run start:dev
```

## Testing
To run the test suite:
```bash
npm test
```