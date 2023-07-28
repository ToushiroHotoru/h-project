// const chalk = require("chalk");
const Manga = require("../../schemas/Manga.schema.js");
const MangaService = require("../../service/Manga.service");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const LINK =
  process.env.NODE_ENV !== "development"
    ? "https://api.h-project.fun"
    : "http://localhost:8080";
class MangaController {
  async getAllMangas(request, reply) {
    try {
      const { page, sort } = request.query;
      const tags = request.query["tags[]"];
      const reg = new RegExp("^[0-9]+$");
      const step = 24;
      const offset = step * (page - 1);
      let total = await Manga.count();
      let mangas = null;

      if (!reg.test(page) || page - 1 < 0 || page - 1 > total / 24) {
        reply.status(500).send({ message: "задана не верная страница" });
      }
      console.log(request.query);
      mangas = await MangaService.mangaSort(sort, offset, step, tags);

      mangas = JSON.parse(JSON.stringify(mangas));
      mangas = mangas.map((item) => {
        const pages = item.pages.map((page) => {
          return LINK + page;
        });
        return {
          ...item,
          cover: LINK + item.cover,
          pages: pages,
          createdAt: dayjs(item.createdAt).format("DD.MM.YYYY"),
        };
      });
      if (tags) {
        total = mangas.length;
      }

      reply.code(200).send({ total, offset, step, mangas });
    } catch (err) {
      // console.log(`Manga sort error - ${chalk.red(err)}`);
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

  async getDynamic(request, reply) {
    try {
      const id = request.query.id;
      let manga = await Manga.getDynamicFields(id);
      const pages = manga.pages.map((item) => {
        return LINK + item;
      });
      manga = JSON.parse(JSON.stringify(manga));
      manga = { ...manga, pages: pages };
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
