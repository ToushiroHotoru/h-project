const CommentsService = require("./Comments.service.js");
const {
  addCommentValidation,
  getCommentValidation,
} = require("./Comments.schema.js");

async function CommentsController(fastify, options) {
  fastify.get(
    "/api/comments/manga-comments",
    getCommentValidation,
    CommentsService.getMangaComments
  );
  fastify.post(
    "/api/comments/add-comment-to-manga",
    addCommentValidation,
    CommentsService.addComment
  );
}

module.exports = CommentsController;
