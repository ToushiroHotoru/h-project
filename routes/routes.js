const IndexRoutes = require("./Index.routes");
const MangaRoutes = require("./Manga.routes");
const TagsRoutes = require("./Tag.routes");
const UserRoutes = require("./User.routes");
const AvatarRoutes = require("./Avatar.routes");
const UserPrivateRoutes = require("./UserPrivate.routes");
const CommentsRoute = require("./Comments.routes");

async function routes(fastify, options) {
  fastify.register(IndexRoutes);
  fastify.register(MangaRoutes);
  fastify.register(TagsRoutes);
  fastify.register(AvatarRoutes);
  fastify.register(UserRoutes);
  fastify.register(UserPrivateRoutes);
  fastify.register(CommentsRoute);
}

module.exports = routes;
