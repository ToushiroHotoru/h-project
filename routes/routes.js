const IndexRoutes = require("./IndexRoutes");
const MangaRoutes = require("./MangaRoutes");
const TagsRoutes = require("./TagRoutes");

async function routes(fastify, options) {
  fastify.register(IndexRoutes);
  fastify.register(MangaRoutes);
  fastify.register(TagsRoutes);
}

module.exports = routes;
