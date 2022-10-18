const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0"; //"localhost";

fastify.register(cors, {
  // put your options here
  origin: true,
});

fastify.register(require("./plugins/mongoose.js"));
fastify.register(require("./routes/dev_routes.js"));

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
