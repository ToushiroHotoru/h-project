const AvatarController = require("../api/avatars/Avatar.controller");

async function AvatarRoutes(fastify, options) {
  fastify.get("/get_avatars", AvatarController.getAvatars);
  fastify.get("/set_avatars", AvatarController.setAvatar);
}

module.exports = AvatarRoutes;
