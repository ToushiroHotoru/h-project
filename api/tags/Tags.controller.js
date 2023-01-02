const Tags = require("../../schemas/Tags.schema");

class TagsController {
  async addTags(request, reply) {
    const { image, miniImage, name, description } = request.body;
    await Tags.add({image, miniImage, name, description});
    reply.code(200).send({ msg: "tag has been created" });
  }

  async deleteTags(request, reply) {
    await Tags.deleteAll();
    reply.code(200).send({ msg: "all tags has been removed" });
  }

  async getAllTags(request, reply) {
    let tags = await Tags.getAll();
    // для локального сервера
    // tags = tags.map((tag) => {
    //   tag.image = "http://localhost:8080" + tag.image;
    //   tag.miniImage = "http://localhost:8080" + tag.miniImage;
    //   return tag;
    // });
    reply.code(200).send({ tags });
  }
}

module.exports = new TagsController();
