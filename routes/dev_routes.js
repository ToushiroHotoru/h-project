async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.get("/", async (request, reply) => {
    reply.send("Привет");
  });

  fastify.get("/test", async (request, reply) => {
    reply.send({ hello: "world" });
  });
}

module.exports = routes;
