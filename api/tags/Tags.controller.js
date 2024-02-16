const TagsService = require("./Tags.service");

async function TagRoutes(fastify, options) {
  fastify.get("/api/get_tags", TagsService.getAllTags);

  fastify.get("/api/get_tags_count", TagsService.getTagsCount);

  fastify.post("/api/write_tags", TagsService.addTags);

  fastify.delete("/api/delete_tags", TagsService.deleteTags);
}

module.exports = TagRoutes;
