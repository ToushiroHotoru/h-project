const UserService = require("./User.service");
const TokenService = require("../../service/Token.service");

async function UserRoutes(fastify, options) {
  fastify.post("/api/user/registration", UserService.registerUser);

  fastify.post("/api/user/login", UserService.loginUser);

  fastify.post("/api/user/set-preferences-tags", UserService.setPreferencesTags);

  fastify.post("/api/user/set-exceptions-tags", UserService.setExceptionsTags);

  fastify.post("/api/user/set-avatar", UserService.setAvatar);

  fastify.get("/api/user/refresh", UserService.refresh);

  fastify.get("/api/user/profile", UserService.userProfile);

  fastify.get("/api/user/role-add-static", UserService.roleSet);

  fastify.get("/api/user/check-is-online", UserService.checkIsOnline);

  fastify.get("/api/user/all-users", UserService.getAllUsers);

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
        url: "/api/logout",
        preHandler: fastify.auth([fastify.verifyJwt]),
        handler: UserService.logoutUser,
      });
    });
}

module.exports = UserRoutes;
