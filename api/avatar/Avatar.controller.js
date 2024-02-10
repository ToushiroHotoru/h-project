const Avatar = require("./Avatar.schema");
const LINK = require("../../utils/API_URL");

class AvatarController {
  async getSiteAvatars(request, reply) {
    try {
      const avatars = await Avatar.getsSiteAvatars();
      const modifiedAvatars = avatars.map((item) => {
        return { ...item, image: LINK + item.image };
      });
      reply.code(200).send({
        status: "success",
        data: { avatars: modifiedAvatars },
      });
    } catch (error) {
      reply.code(500).send({
        status: "error",
        errors: [{ error }],
      });
    }
  }

  async setSiteAvatar(request, reply) {
    for (let i = 1; i < 18; i++) {
      let type = ["png", "jpg"];
      if ([1, 2, 6, 9, 14, 15, 17].includes(i)) {
        await Avatar.create({
          image: `/public/avatars/site_avatars/avatar${i}.${type[0]}`,
          type: "site",
        });
      } else {
        await Avatar.create({
          image: `/public/avatars/site_avatars/avatar${i}.${type[1]}`,
          type: "site",
        });
      }
    }
    reply.code(200).send({ success: true });
  }
}

module.exports = new AvatarController();
