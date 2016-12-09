export default function createArticlesController(knex) {
  return {
    getArticlesList() {
      return knex('article')
        .join('author', 'article.author_id', '=', 'author.id')
        .select(
          'article.id', 'article.title', 'article.summary',
          'article.media_url', 'article.published_at', 'article.likes_count',
          'author.name', 'author.icon_url'
        )
        .then((results) => {
          return results.map(result => {
            const { id, title, summary, media_url, published_at } = result;
            const { likes_count, name, icon_url } = result;

            return {
              id,
              title,
              summary,
              media_url,
              published_at,
              likes_count,
              author: {
                name,
                icon_url,
              },
            };
          });
        });
    },

    getArticle(id) {
      return knex('article')
        .join('author', 'article.author_id', '=', 'author.id')
        .where('article.id', '=', id)
        .select(
          'article.id', 'article.title', 'article.body',
          'article.media_url', 'article.published_at', 'article.likes_count',
          'author.name', 'author.icon_url'
        )
        .then((results) => {
          const result = results[0];

          const { id, title, body, media_url, published_at } = result;
          const { likes_count, name, icon_url } = result;

          return {
            id,
            title,
            body,
            media_url,
            published_at,
            likes_count,
            author: {
              name,
              icon_url,
            },
          };
        });
    },

    createArticle({ title, body, summary, author_id, media_url }) {
      const toInsert = { title, body, summary, author_id };

      if (media_url !== undefined) {
        toInsert.media_url = media_url;
      }

      return knex('article')
        .insert(toInsert)
        .then(() => {
          return knex('article')
            .select('*')
            .where(toInsert);
        })
        .then(results => results[0]);
    },

    updateArticle(id, { title, body, media_url, summary }) {
      const input = { title, body, media_url, summary };

      const toUpdate = Object.keys(input).reduce((output, key) => {
        if (input[key] !== undefined) {
          output[key] = input[key];
        }

        return output;
      }, {});

      return knex('article')
        .where({ id })
        .update(toUpdate)
        .then(() => {
          return knex('article')
            .select('*')
            .where({ id });
        })
        .then(results => results[0]);
    },

    deleteArticle(id) {
      return knex('article')
        .where({ id })
        .del()
    },
  };
}
