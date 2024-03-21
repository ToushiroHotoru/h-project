const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const fastifyStatic = require("@fastify/static");
const chalk = require("chalk");
const path = require("path");
const TokenService = require("./service/Token.service.js");

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

// *---------Auth plugin------------ *//
fastify.register(require("@fastify/auth"));
// *---------Auth plugin------------ *//

// *---------Formdata parser------------ *//
fastify.register(require("@fastify/multipart"));
// *---------Formdata parser------------ *//

// *---------Mongo Connect------------ *//
fastify.register(require("./plugins/mongoose.js"));
// *---------Mongo Connect------------ *//

// *---------Rooutes------------ *//
fastify.register(require("./routes/routes.js"));
// *---------Rooutes------------ *//

fastify.addHook("onRequest", async (request, reply) => {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      request.isAuth = false;
      request.userId = null;
      return;
    }

    const isRefreshTokenValid = await TokenService.verifyRefreshToken(
      refreshToken
    );

    if (isRefreshTokenValid.error) {
      request.isAuth = false;
      request.userId = null;
      return;
    }

    const token = request.headers.authorization
      ? request.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      request.isAuth = false;
      request.userId = null;
      return;
    }

    const isAccessValid = await TokenService.verifyAccessToken(token);

    if (isAccessValid.error) {
      request.isAuth = false;
      request.userId = null;
      return;
    }
    request.isAuth = true;
    request.userId = isAccessValid.user;
  } catch (error) {
    console.log(error);
  }
});

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
