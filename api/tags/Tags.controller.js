const Tags = require("../../schemas/Tags.schema");
const Manga = require("../../schemas/Manga.schema");

class TagsController {
  async addTags(request, reply) {
    const { image, miniImage, name, description } = request.body;
    await Tags.add({ image, miniImage, name, description });
    reply.code(200).send({ msg: "tag has been created" });
  }

  async deleteTags(request, reply) {
    await Tags.deleteAll();
    reply.code(200).send({ msg: "all tags has been removed" });
  }

  async getTagsCount(request, reply) {
    try {
      let selectedTags = request.params;
      let tags2 = await Tags.getAll();
      console.log(selectedTags);

      if (false) {
        const unselectedTags = await Tags.find({ _id: { $nin: [...selectedTags] } });
        const mangasWithSelectedTags = await Manga.find({ tags: { $all: [...selectedTags] } });

        if (Array.isArray(tags)) {
          let result = await Promise.all(unselectedTags.map(async (item) => {
            let count = await Manga.find({ tags: { $all: [...selectedTags, item["name"]] } }).count();
            return { id: item["_id"], name: item["name"], count: count };
          }))
          console.log(result, "BBBBBBBB")
          reply.code(200).send({ tags: "zero" });
        }

        let result = await Promise.all(tags2.map(async (item) => {
          let count = await Manga.find({ tags: item }).count();
          return { id: item["_id"], name: item["name"], count: count };
        }))
        reply.code(200).send({ tags: "zero" });
      }

      const tagsNotFiltered = await Promise.all(tags2.map(async (item) => {
        let count = await Manga.find({ tags: item["_id"] }).count();
        return { id: item["_id"], name: item["name"], count: count }
      }))

      console.log(tagsNotFiltered, "AAAAAAAAAAA")
      reply.code(200).send({ tags: tagsNotFiltered });
    } catch (err) {
      console.log(err.message)
    }

  }

  async getAllTags(request, reply) {
    console.log(request.query.tags, "AAAAAAAAAAAAA");
    let selectedTags = request.query.tags;
    let tags = await Tags.getAll();

    console.log(tags, "BBBBBBBBBB");
    if (selectedTags) {
      if (Array.isArray(selectedTags)) {
        const filteredTagsCount = await Manga.find({ tags: { $all: [...selectedTags] } });
        reply.code(200).send({ tags: tags, filteredTagsCount: filteredTagsCount });
      } else {
        const filteredTagsCount = await Manga.find({ tags: selectedTags });
        reply.code(200).send({ tags: tags, filteredTagsCount: filteredTagsCount });
      }
    }



    // для локального сервера
    // tags = tags.map((tag) => {
    //   tag.image = "http://localhost:8080" + tag.image;
    //   tag.miniImage = "http://localhost:8080" + tag.miniImage;
    //   return tag;
    // });
    reply.code(200).send({ tags: tags });
  }
}

module.exports = new TagsController();
