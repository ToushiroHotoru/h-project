const fastify = require("fastify")({ logger: true });

const PORT = process.env.PORT || 3000;
const HOST = "localhost"; //"0.0.0.0";

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
