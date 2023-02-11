const UserController = require("../api/user/User.controller");

async function TagRoutes(fastify, options) {

  fastify.get("/all-users", UserController.getAllUsers);

  fastify.post("/register", UserController.registerUser);

  fastify.post("/set-preferences-tags", UserController.setPreferencesTags);

  fastify.post("/set-exceptions-tags", UserController.setExceptionsTags);

  fastify.post("/set-avatar", UserController.setAvatar);

}

module.exports = TagRoutes;
