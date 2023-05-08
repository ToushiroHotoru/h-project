const Manga = require("../../schemas/Manga.schema");
const User = require("../../schemas/User.schema");
const Comments = require("../../schemas/Comments.schema");
const Avatar = require("../../schemas/Avatars.schema");
const daysjs = require("dayjs");
const LINK =
  process.env.NODE_ENV !== "development"
    ? "http://h-project.toushirohotoru.repl.co"
    : "http://localhost:8080";
class CommentsController {
  async addComment(request, reply) {
    try {
      const { userId, mangaId, text } = request.body;
      let user = await User.findById(userId).select(['_id', 'username', 'avatar']).lean();
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

      const avatar = await Avatar.findById(user.avatar)
        .select(["image"])
        .lean();
      user = { ...user, avatar: LINK + avatar.image };
      const comment = await Comments.findById(_id).lean();
      const formatedDate = daysjs(comment.createdAt).format("DD.MM.YYYY HH:mm");

      reply.code(200).send({
        id: _id,
        comment: {
          ...comment,
          createdAt: formatedDate,
          user: user,
        },
      });
    } catch (error) {
      reply.code(500).send({ success: false, message: error });
    }
  }

  async getMangaComments(request, reply) {
    try {
      const { mangaId } = request.query;
      const comments = await Comments.find({ manga: mangaId })
        .select(["_id", "text", "user", "answersFor", "createdAt"])
        .lean();
      const comments2 = await Promise.all(
        comments.map(async function (item) {
          const userId = item.user.toString();
          const formatedDate = daysjs(item.createdAt).format(
            "DD.MM.YYYY HH:mm"
          );
          let user = await User.findById(userId)
            .select(["username", "avatar", "_id"])
            .lean();
          const avatar = await Avatar.findById(user.avatar)
            .select(["image"])
            .lean();
          user = { ...user, avatar: LINK + avatar.image };

          const newItem = { ...item, createdAt: formatedDate, user: user };
          return newItem;
        })
      );

      reply.code(200).send({ comments: comments2 });
    } catch (error) {
      console.log(error);
      reply.code(500).send({ error });
    }
  }
}

module.exports = new CommentsController();
