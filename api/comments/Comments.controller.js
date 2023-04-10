const Manga = require("../../schemas/Manga.schema");
const User = require("../../schemas/User.schema");
const Comments = require("../../schemas/Comments.schema");

class CommentsController {
  async addComment(request, reply) {
    try {
      const { userId, mangaId, text } = request.body;
      const user = await User.findById(userId).lean();
      if (!user) {
        return reply
          .code(404)
          .send({ success: false, message: "User not found" });
      }
      const manga = await Manga.findById(mangaId).lean();

      if (!manga) {
        return reply
          .code(404)
          .send({ success: false, message: "Manga not found" });
      }

      const { _id } = await Comments.addComment({ text, mangaId, userId });
      reply
        .code(200)
        .send({ success: true, message: "comment was created", id: _id });
    } catch (error) {
      reply.code(500).send({ success: false, message: error });
    }
  }

  async getMangaComments(request, reply) {
    try {
      const { mangaId } = request.query;
      const comments = await Comments.find({ manga: mangaId }).lean();

      reply.code(200).send({ comments });
    } catch (error) {
      reply.code(500).send({ error });
    }
  }
}

module.exports = new CommentsController();
