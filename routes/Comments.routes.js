const commentsController = require("../api/comments/Comments.controller.js");

async function CommentsRoutes(fastify, options) {
  fastify.post("/add_comment", commentsController.addComment);
}

module.exports = CommentsRoutes;
