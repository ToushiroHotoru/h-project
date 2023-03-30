const UserController = require("../api/user/User.controller");
const TokenService = require("../service/Token.service");

async function UserPrivateRoutes(fastify, options) {
  fastify
    .decorate("verifyJwt", async function (request, reply) {
      try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
          throw new Error("No token was sent");
        }

        const bearerToken = authHeader.split(" ")[1];
        if (!bearerToken) {
          throw new Error("Token not found");
        }

        const userData = await TokenService.verifyAccessToken(bearerToken);

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
        method: "DELETE",
        url: "/logout",
        preHandler: fastify.auth([fastify.verifyJwt]),
        handler: UserController.logoutUser,
      });

      fastify.route({
        method: "GET",
        url: "/user",
        preHandler: fastify.auth([fastify.verifyJwt]),
        handler: UserController.userProfile,
      });
    });
}

module.exports = UserPrivateRoutes;
