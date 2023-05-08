const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const fastifyStatic = require("@fastify/static");
const chalk = require("chalk");
const path = require("path");

const PORT = process.env.PORT || 8080;
const HOST = process.env.NODE_ENV === "development" ? "localhost" : "0.0.0.0";

fastify.register(cors, {
  origin: true,
  credentials: true,
});

// *---------Static files route------------ *//
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "upload"),
  prefix: "/upload/",
  decorateReply: false,
});

// ! Удалить в будущем
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "test_manga_storage"),
  prefix: "/test_manga_storage/",
  decorateReply: false,
});
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "manga_cover"),
  prefix: "/manga_cover/",
  decorateReply: false,
});
// *---------Static files route------------ *//

// *---------Cookie parser------------ *//
fastify.register(require("@fastify/cookie"), {
  secret: "my-secret",
  hook: "onRequest",
});
// *---------Cookie parser------------ *//

// *---------Formdata parser------------ *//
fastify.register(require("@fastify/multipart"));
// *---------Formdata parser------------ *//

// *---------Mongo Connect------------ *//
fastify.register(require("./plugins/mongoose.js"));
// *---------Mongo Connect------------ *//

// *---------Auth plugin------------ *//
fastify.register(require("@fastify/auth"));
// *---------Auth plugin------------ *//

// *---------Rooutes------------ *//
fastify.register(require("./routes/routes.js"));
// *---------Rooutes------------ *//

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST });
    // console.log(chalk.blue(`Server started - http://${HOST}:${PORT}`));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
