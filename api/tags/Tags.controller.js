const TagsService = require("./Tags.service");

async function TagRoutes(fastify, options) {
  fastify.get("/api/tags", TagsService.getAllTags);

  fastify.get("/api/tags-count", TagsService.getTagsCount);

  fastify.post("/api/write-tags", TagsService.addTags);

  fastify.delete("/api/delete-tags", TagsService.deleteTags);
}

module.exports = TagRoutes;
