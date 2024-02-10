const UserController = require("./User.controller");

async function UserRoutes(fastify, options) {
  fastify.post("/api/registration", UserController.registerUser);

  fastify.post("/api/login", UserController.loginUser);

  fastify.post("/api/set_preferences_tags", UserController.setPreferencesTags);

  fastify.post("/api/set_exceptions_tags", UserController.setExceptionsTags);

  fastify.post("/api/set_avatar", UserController.setAvatar);

  fastify.get("/api/refresh", UserController.refresh);

  fastify.get("/api/user", UserController.userProfile);
}

module.exports = UserRoutes;
