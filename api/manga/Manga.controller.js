// const chalk = require("chalk");
const dayjs = require("dayjs");
const sizeOf = require("image-size");
const path = require("path");

const Manga = require("../../schemas/Manga.schema.js");
const MangaService = require("../../service/Manga.service");
const LINK = require("../../utils/API_URL.js");

class MangaController {
  async getAllMangas(request, reply) {
    try {
      const { page, sort } = request.query;
      console.log(request.query["tags"]);
      const tags = request.query["tags"]
        ? request.query["tags"].split(",")
        : "";
      const reg = new RegExp("^[0-9]+$");
      const step = 24;
      const offset = step * (page - 1);
      const mangaTotal = await Manga.count();

      if (!reg.test(page) || page - 1 < 0 || page - 1 > mangaTotal / 24) {
        reply
          .status(404)
          .send({ message: "задана не верная страница", total: 0, mangas: [] });
      }
      let mangasService = await MangaService.mangaSort(
        sort,
        offset,
        step,
        tags
      );

      const mangas = mangasService.mangas.map((item) => {
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
      const total = mangasService.total;
      reply.code(200).send({ total, offset, step, mangas });
    } catch (err) {
      console.log(err);
    }
  }

  async getMangasId(request, reply) {
    try {
      const mangas = await Manga.getAllMangasId();
      reply.code(200).send(mangas);
    } catch (error) {
      // console.log(chalk.red(error));
    }
  }

  async deleteMangaById(request, reply) {
    try {
      const { id } = request.body;
      await Manga.deleteOne({ _id: id });
      reply.code(200).send({ msg: `manga by id - '${id}' was deleted` });
    } catch (err) {
      // console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async deleteMangaAll(request, reply) {
    try {
      await Manga.deleteMany({});
      reply.code(200).send({ msg: "all mangas was deleted" });
    } catch (err) {
      // console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async getStatic(request, reply) {
    try {
      const id = request.query.id;
      let manga = await Manga.getStaticFields(id);
      manga = JSON.parse(JSON.stringify(manga));
      manga = { ...manga, cover: LINK + manga.cover };
      reply.code(200).send(manga);
    } catch (err) {
      // console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async getMangaForReader(request, reply) {
    try {
      const id = request.query.id;
      let manga = await Manga.getMangaPages(id);

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

      reply.code(200).send(manga);
    } catch (err) {
      reply.code(500).send(err);
    }
  }

  async getDynamic(request, reply) {
    try {
      const id = request.query.id;
      let manga = await Manga.getDynamicFields(id);
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

      reply.code(200).send(manga);
    } catch (err) {
      // console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async mangaAppendMany(request, reply) {
    try {
      MangaService.mangaAppendService();
      reply.code(200).send({ msg: "72 records created" });
    } catch (err) {
      // console.log(`New user error - ${chalk.red(err)}`);
    }
  }

  async mangaAppendOne(request, reply) {
    try {
      console.log(request.body);
      const result = await MangaService.mangaAppendOneService(request.body);
      console.log(result);
      reply.code(200).send({ msg: `manga was written ${result._id}` });
    } catch (err) {
      // console.log(`New user error - ${chalk.red(err)}`);
    }
  }

  async newMangas(req, reply) {
    try {
      let manga = await Manga.find({})
        .sort({ createdAt: "desc" })
        .select("_id title cover")
        .limit(8)
        .lean();
      manga = manga.map((item) => {
        return { ...item, cover: LINK + item.cover };
      });
      console.log(manga);
      reply.code(200).send({ manga: manga });
    } catch (error) {}
  }
}

module.exports = new MangaController();
