const IndexRoutes = require("./IndexRoutes");
const MangaRoutes = require("./MangaRoutes");
const TagsRoutes = require("./TagRoutes");
const UserRoutes = require("./UserRoutes")

async function routes(fastify, options) {
  fastify.register(IndexRoutes);
  fastify.register(MangaRoutes);
  fastify.register(TagsRoutes);
  fastify.register(UserRoutes);
}

module.exports = routes;
