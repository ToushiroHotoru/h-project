const UserController = require("../api/user/User.controller");

async function TagRoutes(fastify, options) {
  fastify.get("/all-users", UserController.getAllUsers);

  fastify.post("/registration", UserController.registerUser);

  fastify.post("/login", UserController.loginUser);

  fastify.post("/set_preferences_tags", UserController.setPreferencesTags);

  fastify.post("/set_exceptions_tags", UserController.setExceptionsTags);

  fastify.post("/set_avatar", UserController.setAvatar);

  fastify.get("/logout", UserController.logoutUser);
}

module.exports = TagRoutes;
