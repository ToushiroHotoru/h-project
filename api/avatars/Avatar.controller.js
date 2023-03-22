const Avatar = require("../../schemas/Avatars.schema");
const LINK =
  process.env.NODE_ENV !== "development"
    ? "https://h-project.toushirohotoru.repl.co"
    : "http://localhost:8080";

class AvatarController {
  async getAvatars(request, reply) {
    const avatars = await Avatar.find({ type: "site" }).lean();
    const modified = avatars.map((item) => {
      return { ...item, image: LINK + item.image };
    });
    reply.code(200).send({ avatars: modified });
  }

  async setSiteAvatar(request, reply) {
    for (let i = 1; i < 18; i++) {
      let type = ["png", "jpg"];
      if ([1, 2, 6, 9, 14, 15, 17].includes(i)) {
        await Avatar.create({
          image: `/public/avatars/avatar${i}.${type[0]}`,
          type: "site",
        });
      } else {
        await Avatar.create({
          image: `/public/avatars/avatar${i}.${type[1]}`,
          type: "site",
        });
      }
    }
    reply.code(200).send({ success: true });
  }
}

module.exports = new AvatarController();
