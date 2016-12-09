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
  };
}
