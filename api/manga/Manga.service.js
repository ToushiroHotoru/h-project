const dayjs = require("dayjs");
const sizeOf = require("image-size");

const Manga = require("./Manga.model.js");
const MangaService = require("./Manga.utils.js");
const LINK = require("../../utils/API_URL.js");
const TagsModel = require("../tags/Tags.model.js");

class MangaController {
  async getAllMangas(request, reply) {
    try {
      const { page, sort } = request.query;
      const tags = request.query["tags"]
        ? request.query["tags"].split(",")
        : "";
      const reg = new RegExp("^[0-9]+$");
      const step = 24;
      const offset = step * (page - 1);
      const mangaTotal = await Manga.count();

      if (!reg.test(page) || page - 1 < 0 || page - 1 > mangaTotal / 24) {
        reply.status(404).send({
          status: "error",
          message: "Страница не найдена",
          total: 0,
          mangas: [],
        });
      }
      
      const tagsIds = await Promise.all(
        tags.map(async (tagName) => {
          console.log(tagName);
          const tag = await TagsModel.findOne({
            nameEn: tagName.trim(),
          }).select("_id");
          return tag._id;
        })
      );

      const sortedMangas = await MangaService.mangaSort(
        sort,
        offset,
        step,
        tagsIds
      );

      const mangas = sortedMangas.mangas.map((item) => {
        const pages = item.pages.map((page) => {
          return LINK + page;
        });
        const tags = item.tags.map((tag) => {
          return {
            ...tag,
            image: LINK + tag.image,
            miniImage: LINK + tag.miniImage,
          };
        });
        return {
          ...item,
          cover: LINK + item.cover,
          pages: pages,
          tags: tags,
          createdAt: dayjs(item.createdAt).format("DD.MM.YYYY"),
        };
      });
      const total = sortedMangas.total;
      reply
        .code(200)
        .send({ status: "success", data: { total, offset, step, mangas } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async getMangasId(request, reply) {
    try {
      const mangas = await Manga.getAllMangasId();
      reply.code(200).send({ status: "success", data: { mangas } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async deleteMangaById(request, reply) {
    try {
      const { id } = request.body;
      await Manga.deleteOne({ _id: id });
      reply.code(200).send({
        status: "success",
        message: `manga by id - '${id}' was deleted`,
      });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async deleteMangaAll(request, reply) {
    try {
      await Manga.deleteMany({});
      reply
        .code(200)
        .send({ status: "success", message: "all mangas was deleted" });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async getStatic(request, reply) {
    try {
      const { route } = request.query;
      let manga = await Manga.getStaticFields(route);
      manga = { ...manga, cover: LINK + manga.cover };
      reply.code(200).send({ status: "success", data: { manga } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async getMangaPagesForReader(request, reply) {
    try {
      const { route } = request.query;
      let manga = await Manga.getMangaPages(route);

      console.log(manga);

      const pages = manga.pages.map((item) => {
        return {
          size: sizeOf(process.cwd() + item),
          image: LINK + item,
        };
      });
      manga = {
        ...manga,
        pages: pages,
      };

      reply.code(200).send({ status: "success", data: { manga } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async getDynamic(request, reply) {
    try {
      const { route } = request.query;
      let manga = await Manga.getDynamicFields(route);
      const pages = manga.pages.map((item) => {
        return LINK + item;
      });
      manga = JSON.parse(JSON.stringify(manga));
      manga = {
        ...manga,
        pages: pages,
        tags: manga.tags.map((tag) => {
          return {
            ...tag,
            image: LINK + tag.image,
            miniImage: LINK + tag.miniImage,
          };
        }),
      };

      reply.code(200).send({ status: "success", data: { manga } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async mangaAppendMany(request, reply) {
    try {
      MangaService.mangaAppendService();
      reply
        .code(200)
        .send({ status: "success", message: "72 records created" });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async mangaAppendOne(request, reply) {
    try {
      const result = await MangaService.mangaAppendOneService(request.body);
      reply.code(200).send({
        status: "success",
        message: `manga was written ${result._id}`,
      });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async updateRoutes(request, reply) {
    try {
      const result = await Manga.find().lean();
      result.map(async (manga) => {
        await Manga.findByIdAndUpdate(manga._id, {
          route: manga.title
            .toLowerCase()
            .replace('(.|,|_|{|}|?|/|:|;|[|]|+|=|%|$|#|@|"|\\|<|>)', "-")
            .replace(" ", "-"),
        });
      });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async addNewMangasStatic(request, reply) {
    try {
      const result = await MangaService.addNewMangaStatic();
      reply.code(200).send({
        status: "success",
        message: `manga was written `,
      });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async lastPublishedMangas(request, reply) {
    try {
      let mangas = await Manga.getLastPublishedMangas();
      mangas = mangas.map((item) => {
        return {
          ...item,
          cover: LINK + item.cover,
        };
      });
      reply.code(200).send({ status: "success", data: { mangas } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async mostViewedOnLastWeekMangas(request, reply) {
    try {
      let mangas = await Manga.getMostViewedOnLastWeekMangas();
      mangas = mangas.map((item) => {
        return {
          ...item,
          cover: LINK + item.cover,
        };
      });
      reply.code(200).send({ status: "success", data: { mangas } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }

  async mostLikedOnLastWeekMangas(request, reply) {
    try {
      let mangas = await Manga.getMostLikedOnLastWeekMangas();
      mangas = mangas.map((item) => {
        return {
          ...item,
          cover: LINK + item.cover,
        };
      });
      reply.code(200).send({ status: "success", data: { mangas } });
    } catch (error) {
      reply.code(500).send({ status: "error", message: error });
    }
  }
}

module.exports = new MangaController();
