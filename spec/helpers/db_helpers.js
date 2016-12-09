export function setup(knex) {
  return new Promise((resolve, reject) => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => resolve())
    .catch(error => reject(error));
  });
}
