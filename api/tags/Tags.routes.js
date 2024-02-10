const TagsController = require("./Tags.controller");

async function TagRoutes(fastify, options) {
  fastify.get("/api/get_tags", TagsController.getAllTags);

  fastify.get("/api/get_tags_count", TagsController.getTagsCount);

  fastify.post("/api/write_tags", TagsController.addTags);

  fastify.delete("/api/delete_tags", TagsController.deleteTags);
}

module.exports = TagRoutes;
