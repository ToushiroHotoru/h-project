const CommentsService = require("./Comments.service.js");
const {
  addCommentValidation,
  getCommentValidation,
} = require("./Comments.schema.js");

async function CommentsController(fastify, options) {
  fastify.get(
    "/api/get_comments",
    getCommentValidation,
    CommentsService.getMangaComments
  );
  fastify.post(
    "/api/add_comment",
    addCommentValidation,
    CommentsService.addComment
  );
}

module.exports = CommentsController;
