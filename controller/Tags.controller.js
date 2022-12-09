const Tags = require("../models/Tags.model");
const os = require("os");

class TagsController {
  async addTags(request, reply) {
    const tag1 = await Tags.add({ name: "Школьницы" });
    const tag2 = await Tags.add({ name: "В общественном месте" });
    const tag3 = await Tags.add({ name: "Мерзкий дядька" });
    const tag4 = await Tags.add({ name: "Netorare" });
    reply.code(200).send({ tag1, tag2, tag3, tag4 });
  }

  async deleteTags(request, reply) {
    const tags = await Tags.deleteAll();
    reply.code(200).send({ tags });
  }

  async getAllTags(request, reply) {
    let tags = await Tags.getAll();
    tags = tags.map((tag) => {
      tag.image = "http://localhost:8080" + tag.image;
      tag.miniImage = "http://localhost:8080" + tag.miniImage;
      return tag;
    });
    reply.code(200).send({ tags });
  }
}

module.exports = new TagsController();
