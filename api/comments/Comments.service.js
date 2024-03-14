const daysjs = require("dayjs");

const User = require("../user/User.model");
const Avatar = require("../avatar/Avatar.model");
const Comments = require("./Comments.model");
const Manga = require("../manga/Manga.model");

const LINK = require("../../utils/API_URL");
const chalk = require("chalk");

class CommentsController {
  async addComment(request, reply) {
    try {
      if (!request.isAuth)
        return reply
          .code(401)
          .send({ status: "error", message: "Вы не авторизованы" });
      const userId = request.userId;
      const { mangaId, text } = request.body;
      let user = await User.findById(userId)
        .select(["_id", "username", "avatar"])
        .lean();

      if (!user) {
        return reply
          .code(404)
          .send({ status: "error", message: "User not found" });
      }

      const manga = await Manga.findOne({ route: mangaId }).lean();

      if (!manga) {
        return reply
          .code(404)
          .send({ status: "error", message: "Manga not found" });
      }
      const { _id } = await Comments.addComment({
        text,
        mangaId: manga._id,
        userId,
      });
      const avatar = await Avatar.findById(user.avatar)
        .select(["image"])
        .lean();
      user = { ...user, avatar: LINK + avatar.image };
      const comment = await Comments.findById(_id)
        .select("text answersFor")
        .lean();
      const formatedDate = daysjs(comment.createdAt).format("DD.MM.YYYY HH:mm");
      reply.code(200).send({
        status: "success",
        data: {
          id: _id,
          comment: {
            ...comment,
            createdAt: formatedDate,
          },
          user: user,
        },
      });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error.message });
    }
  }

  async getMangaComments(request, reply) {
    try {
      const { route } = request.query;
      const { _id } = await Manga.findOne({ route: route });
      const comments = await Comments.find({ manga: _id })
        .sort({ createdAt: "desc" })
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

      reply
        .code(200)
        .send({ status: "success", data: { comments: comments2 } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error.message });
    }
  }

  async deleteComment(request, reply) {
    try {
      // if(request.)

    } catch (error) {
      reply.code(500).send({ status: "error", message: error.message });
    }
  }
}

module.exports = new CommentsController();
