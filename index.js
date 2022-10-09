const fastify = require("fastify")({ logger: true });

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

fastify.register(require("./routes/dev_routes.js"));

// Declare a route


// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
