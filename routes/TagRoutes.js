const TagsController = require("../api/tags/Tags.controller");

async function TagRoutes(fastify, options) {
  fastify.get("/get_tags", TagsController.getAllTags);

  fastify.get("/get_tags_count", TagsController.getTagsCount);

  fastify.post("/write_tags", TagsController.addTags);

  fastify.delete("/delete_tags", TagsController.deleteTags);
}

module.exports = TagRoutes;
