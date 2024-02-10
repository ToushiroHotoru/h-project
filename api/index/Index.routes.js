const Index = require("./Index.controller");

async function IndexRoutes(fastify, options) {
  fastify.get("/", Index.welcomePage);
}

module.exports = IndexRoutes;
