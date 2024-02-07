const UserController = require("../api/user/User.controller");
const TokenService = require("../service/Token.service");

async function UserPrivateRoutes(fastify, options) {
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
        handler: UserController.getAllUsers,
      });

      fastify.route({
        method: "POST",
        url: "/logout",
        preHandler: fastify.auth([fastify.verifyJwt]),
        handler: UserController.logoutUser,
      });
    });
}

module.exports = UserPrivateRoutes;
