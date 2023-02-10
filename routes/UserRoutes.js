const UserController = require("../api/user/User.controller");

async function TagRoutes(fastify, options) {
  fastify.get("/all-users", UserController.getAllUsers);

  fastify.post("/register", UserController.registerUser);

  fastify.post("/set-preferences-tags", UserController.setPreferencesTags);

}

module.exports = TagRoutes;
