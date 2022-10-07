const fastify = require("fastify")({ logger: true });

// Declare a route
fastify.get("/test", async (request, reply) => {
  return { hello: "world1" };
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
