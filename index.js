const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const fastifyStatic = require("@fastify/static");
const chalk = require("chalk");
const path = require("path");

const PORT = process.env.PORT || 8080;
const HOST = process.env.NODE_ENV === "development" ? "localhost" : "0.0.0.0";

fastify.register(cors, {
  origin: true,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "upload"),
  prefix: "/upload/",
  decorateReply: false,
});
fastify.register(require("@fastify/cookie"), {
  secret: "my-secret",
  hook: "onRequest",
});
fastify.register(require("@fastify/multipart"));
// fastify.register(require("bcryptjs"));
// fastify.register(require("./plugins/bcrypt.js"));
fastify.register(require("./plugins/jwt.js"));
fastify.register(require("./plugins/mongoose.js"));
fastify.register(require("./routes/routes.js"));

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(chalk.blue(`Server started - http://${HOST}:${PORT}`));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
