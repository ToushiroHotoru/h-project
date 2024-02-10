const Tags = require("./Tags.schema");
const Manga = require("../manga/Manga.schema");
const LINK = require("../../utils/API_URL");

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
      let selectedTags = request.query?.tags
        ? request.query.tags.split(",")
        : [];
      let tags2 = await Tags.getAll();
      // console.log(selectedTags, selectedTags.length);

      if (selectedTags.length) {
        const unselectedTags = await Tags.find({
          _id: { $nin: [...selectedTags] },
        });
        const mangasWithSelectedTags = await Manga.find({
          tags: { $all: [...selectedTags] },
        });

        // console.log("works 1");

        if (Array.isArray(selectedTags)) {
          // console.log("works 2");
          let result = await Promise.all(
            unselectedTags.map(async (item) => {
              let count = await Manga.find({
                tags: { $all: [...selectedTags, item["_id"]] },
              }).count();
              return { id: item["_id"], name: item["name"], count: count };
            })
          );
          // console.log(result, "BBBBBBBB");
          return reply
            .code(200)
            .send({ tags: result.filter((item) => item["count"] != 0) });
        }

        let result = await Promise.all(
          tags2.map(async (item) => {
            let count = await Manga.find({ tags: selectedTags }).count();
            return { id: item["_id"], name: item["name"], count: count };
          })
        );
        return reply
          .code(200)
          .send({ tags: result.filter((item) => item["count"] != 0) });
      }

      const tagsNotFiltered = await Promise.all(
        tags2.map(async (item) => {
          let count = await Manga.find({ tags: item["_id"] }).count();
          return { id: item["_id"], name: item["name"], count: count };
        })
      );

      reply.code(200).send({ tags: tagsNotFiltered });
    } catch (err) {
      console.log(err.message);
    }
  }

  async getAllTags(request, reply) {
    let selectedTags = request.query.tags;
    let tags = await Tags.getAll();
    if (selectedTags) {
      if (Array.isArray(selectedTags)) {
        const filteredTagsCount = await Manga.find({
          tags: { $all: [...selectedTags] },
        });
        reply
          .code(200)
          .send({ tags: tags, filteredTagsCount: filteredTagsCount });
      } else {
        const filteredTagsCount = await Manga.find({ tags: selectedTags });
        reply
          .code(200)
          .send({ tags: tags, filteredTagsCount: filteredTagsCount });
      }
    }

    tags.forEach(async (tag) => {
      let tagsCount = await Manga.find({ tags: tag }).count();
      await Tags.findByIdAndUpdate(tag._id, { count: tagsCount });
    });

    tags = await Tags.getAll();
    tags = tags.map((tag) => {
      return {
        ...tag,
        image: LINK + tag.image,
        miniImage: LINK + tag.miniImage,
      };
    });

    // console.log(tags);

    reply.code(200).send({ tags });
  }
}

module.exports = new TagsController();
