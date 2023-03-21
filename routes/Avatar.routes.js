const AvatarController = require("../api/avatars/Avatar.controller");

async function AvatarRoutes(fastify, options) {
  fastify.get("/get_avatars", AvatarController.getAvatars);
  fastify.get("/set_site_avatar", AvatarController.setSiteAvatar);
}

module.exports = AvatarRoutes;
