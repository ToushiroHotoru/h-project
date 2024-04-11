const AvatarService = require("./Avatar.service");

async function AvatarRoutes(fastify, options) {
  fastify.get("/api/avatar/site-avatars", AvatarService.getSiteAvatars);
  fastify.post("/api/avatar/add-site-avatar", AvatarService.setSiteAvatar);
}

module.exports = AvatarRoutes;
