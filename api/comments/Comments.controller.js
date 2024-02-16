const CommentsService = require("./Comments.service.js");

async function CommentsRoutes(fastify, options) {
  fastify.get("/api/get_comments", CommentsService.getMangaComments);
  fastify.post("/api/add_comment", CommentsService.addComment);
}

module.exports = CommentsRoutes;
