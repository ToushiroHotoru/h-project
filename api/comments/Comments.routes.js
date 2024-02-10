const CommentsController = require("./Comments.controller.js");

async function CommentsRoutes(fastify, options) {
  fastify.get("/api/get_comments", CommentsController.getMangaComments);
  fastify.post("/api/add_comment", CommentsController.addComment);
}

module.exports = CommentsRoutes;
