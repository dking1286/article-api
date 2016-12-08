
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('article', (table) => {
      table.increments();
      table.timestamp('published_at').defaultTo(knex.fn.now());

      table.string('title').notNullable();
      table.text('body').notNullable();
      table.string('media_url');
      table.integer('likes_count');
      table.integer('author_id');
    }),

    knex.schema.createTable('author', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.string('icon_url');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('article'),
    knex.schema.dropTable('author'),
  ]);
};
