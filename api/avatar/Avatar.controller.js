const AvatarService = require("./Avatar.service");

async function AvatarRoutes(fastify, options) {
  fastify.get("/api/get_site_avatars", AvatarService.getSiteAvatars);
  fastify.get("/api/set_site_avatar", AvatarService.setSiteAvatar);
}

module.exports = AvatarRoutes;
