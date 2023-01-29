const TagsController = require("../api/tags/Tags.controller");

const schema = {
  querystring: {
    name: { type: 'string' },
  },

}


async function TagRoutes(fastify, options) {
  fastify.get("/get_tags", TagsController.getAllTags);

  fastify.get("/get_tags_count", {schema}, TagsController.getTagsCount);

  fastify.post("/write_tags", TagsController.addTags);

  fastify.delete("/delete_tags", TagsController.deleteTags);
}

module.exports = TagRoutes;
