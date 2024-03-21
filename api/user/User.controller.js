const UserService = require("./User.service");
const TokenService = require("../../service/Token.service");

async function UserRoutes(fastify, options) {
  fastify.post("/api/registration", UserService.registerUser);

  fastify.post("/api/login", UserService.loginUser);

  fastify.post("/api/set-preferences-tags", UserService.setPreferencesTags);

  fastify.post("/api/set-exceptions-tags", UserService.setExceptionsTags);

  fastify.post("/api/set-avatar", UserService.setAvatar);

  fastify.get("/api/refresh", UserService.refresh);

  fastify.get("/api/user", UserService.userProfile);

  fastify.get("/api/role-add-static", UserService.roleSet);

  fastify.get("/api/check-is-online", UserService.checkIsOnline);

  fastify.get("/api/decode-jwt", UserService.decodeJwt);

  fastify
    .decorate("verifyJwt", async function (request, reply) {
      try {
        const token = request.headers.authorization.split(" ")[1];

        if (!token) {
          return reply.code(401).send({ error: "No token was sent" });
        }

        const userData = await TokenService.verifyAccessToken(token);

        request.user = userData;
      } catch (error) {
        reply.code(401).send(error);
      }
    })
    .register(require("@fastify/auth"))
    .after(() => {
      fastify.route({
        method: "GET",
        url: "/all-users",
        preHandler: fastify.auth([fastify.verifyJwt]),
        handler: UserService.getAllUsers,
      });

      fastify.route({
        method: "POST",
        url: "/logout",
        preHandler: fastify.auth([fastify.verifyJwt]),
        handler: UserService.logoutUser,
      });
    });
}

module.exports = UserRoutes;
