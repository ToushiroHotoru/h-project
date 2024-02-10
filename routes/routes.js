const IndexRoutes = require("../api/index/Index.routes");
const MangaRoutes = require("../api/manga/Manga.routes");
const TagsRoutes = require("../api/tags/Tags.routes");
const UserRoutes = require("../api/user/User.routes");
const AvatarRoutes = require("../api/avatar/Avatar.routes");
const UserPrivateRoutes = require("../api/user/UserPrivate.routes");
const CommentsRoute = require("../api/comments/Comments.routes");

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
