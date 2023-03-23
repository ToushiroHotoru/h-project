const UserController = require("../api/user/User.controller");

async function UserRoutes(fastify, options) {
  fastify.post("/registration", UserController.registerUser);

  fastify.post("/login", UserController.loginUser);

  fastify.post("/set_preferences_tags", UserController.setPreferencesTags);

  fastify.post("/set_exceptions_tags", UserController.setExceptionsTags);

  fastify.post("/set_avatar", UserController.setAvatar);
}

module.exports = UserRoutes;
