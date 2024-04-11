const TagsService = require("./Tags.service");

async function TagRoutes(fastify, options) {
  fastify.get("/api/tags/all", TagsService.getAllTags);

  fastify.get("/api/tags/count", TagsService.getTagsCount);

  fastify.post("/api/tags/add", TagsService.addTags);

  fastify.delete("/api/tags/delete", TagsService.deleteTags);
}

module.exports = TagRoutes;
