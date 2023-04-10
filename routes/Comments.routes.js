const commentsController = require("../api/comments/Comments.controller.js");

async function CommentsRoutes(fastify, options) {
  fastify.post("/add_comment", commentsController.addComment);
  fastify.get("/get_comments", commentsController.getMangaComments);
}

module.exports = CommentsRoutes;
