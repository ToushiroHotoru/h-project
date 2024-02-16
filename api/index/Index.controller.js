const IndexService = require("./Index.service");

async function IndexRoutes(fastify, options) {
  fastify.get("/", IndexService.welcomePage);
}

module.exports = IndexRoutes;
