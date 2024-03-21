const Tags = require("./Tags.model");
const Manga = require("../manga/Manga.model");
const LINK = require("../../utils/API_URL");

class TagsController {
  async addTags(request, reply) {
    try {
      const { image, miniImage, name, description } = request.body;
      await Tags.add({ image, miniImage, name, description });
      reply
        .code(200)
        .send({ status: "success", message: "tag has been created" });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async deleteTags(request, reply) {
    try {
      await Tags.deleteAll();
      reply
        .code(200)
        .send({ status: "success", message: "all tags has been removed" });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async getTagsCount(request, reply) {
    try {
      let selectedTags = request.query?.tags
        ? request.query.tags.split(",")
        : [];
      let tags2 = await Tags.getAll();

      if (selectedTags.length) {
        const unselectedTags = await Tags.find({
          _id: { $nin: [...selectedTags] },
        });
        const mangasWithSelectedTags = await Manga.find({
          tags: { $all: [...selectedTags] },
        });


        if (Array.isArray(selectedTags)) {
          let result = await Promise.all(
            unselectedTags.map(async (item) => {
              let count = await Manga.find({
                tags: { $all: [...selectedTags, item["_id"]] },
              }).count();
              return { id: item["_id"], name: item["name"], count: count };
            })
          );
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

      reply
        .code(200)
        .send({ status: "success", data: { tags: tagsNotFiltered } });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async getAllTags(request, reply) {
    try {
      let tags = await Tags.getAll();
      tags = tags.map((tag) => {
        return {
          ...tag,
          image: LINK + tag.image,
          miniImage: LINK + tag.miniImage,
        };
      });

      reply.code(200).send({ status: "success", data: { tags } });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }
}

module.exports = new TagsController();
