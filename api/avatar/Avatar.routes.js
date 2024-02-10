const AvatarController = require("./Avatar.controller");

async function AvatarRoutes(fastify, options) {
  fastify.get("/api/get_site_avatars", AvatarController.getSiteAvatars);
  fastify.get("/api/set_site_avatar", AvatarController.setSiteAvatar);
}

module.exports = AvatarRoutes;
