const AvatarService = require("./Avatar.service");

async function AvatarRoutes(fastify, options) {
  fastify.get("/api/site-avatars", AvatarService.getSiteAvatars);
  fastify.post("/api/add-site-avatar", AvatarService.setSiteAvatar);
}

module.exports = AvatarRoutes;
