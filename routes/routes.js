const IndexRoutes = require("./Index.routes");
const MangaRoutes = require("./Manga.routes");
const TagsRoutes = require("./Tag.routes");
const UserRoutes = require("./User.routes");
const AvatarRoutes = require("./Avatar.routes");

async function routes(fastify, options) {
  fastify.register(IndexRoutes);
  fastify.register(MangaRoutes);
  fastify.register(TagsRoutes);
  fastify.register(UserRoutes);
  fastify.register(AvatarRoutes);
}

module.exports = routes;
