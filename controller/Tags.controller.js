const chalk = require("chalk");
const Tags = require("../models/Tags.model");

class TagsController {
  async addTags(request, reply) {
    const tag1 = await Tags.add({ name: "Школьницы" });
    const tag2 = await Tags.add({ name: "В общественном месте" });
    const tag3 = await Tags.add({ name: "Мерзкий дядька" });
    const tag4 = await Tags.add({ name: "Netorare" });
    reply.code(200).send({ tag1, tag2, tag3, tag4 });
  }

  async deleteTags(request, reply) {
    const tag = await Tags.deleteAll();
    reply.code(200).send({ tag });
  }
}

module.exports = new TagsController();
