const IndexController = require("../api/index/Index.controller");
const MangaController = require("../api/manga/Manga.controller");
const TagsController = require("../api/tags/Tags.controller");
const UserController = require("../api/user/User.controller");
const AvatarController = require("../api/avatar/Avatar.controller");
const CommentsController = require("../api/comments/Comments.controller");

async function routes(fastify, options) {
  fastify.register(IndexController);
  fastify.register(MangaController);
  fastify.register(TagsController);
  fastify.register(AvatarController);
  fastify.register(UserController);
  fastify.register(CommentsController);
}

module.exports = routes;
