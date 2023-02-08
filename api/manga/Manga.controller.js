const chalk = require("chalk");
const Manga = require("../../schemas/Manga.schema.js");
const MangaService = require("../../service/Manga.service");
const mongoose = require('mongoose');

class MangaController {
  async getAllMangas(request, reply) {
    try {
      const { page, sort, tags } = request.query;
      const reg = new RegExp("^[0-9]+$");
      const step = 24;
      const offset = step * (page - 1);
      let total = await Manga.count();
      let mangas = null;

      if (!reg.test(page) || page - 1 < 0 || page - 1 > total / 24) {
        reply.status(500).send({ message: "задана не верная страница" });
      }

      mangas = await MangaService.mangaSort(sort, offset, step, tags ? tags.split("%2C") : null);

      if (tags) {
        total = mangas.length;
      }

      reply.code(200).send({ total, offset, step, mangas });
    } catch (err) {
      console.log(`Manga sort error - ${chalk.red(err)}`);
    }
  }

  async getMangasId(request, reply) {
    try {
      const mangas = await Manga.getAllMangasId();
      reply.code(200).send(mangas);
    } catch (error) {
      console.log(chalk.red(error));
    }
  }

  async deleteMangaById(request, reply) {
    try {
      const { id } = request.body;
      await Manga.deleteOne({ _id: id });
      reply.code(200).send({ msg: `manga by id - '${id}' was deleted` });
    } catch (err) {
      console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async deleteMangaAll(request, reply) {
    try {
      await Manga.deleteMany({});
      reply.code(200).send({ msg: "all mangas was deleted" });
    } catch (err) {
      console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async getStatic(request, reply) {
    try {
      const manga = await Manga.getStaticFields(request.body.id);
      reply.code(200).send(manga);
    } catch (err) {
      console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async getDynamic(request, reply) {
    try {
      const manga = await Manga.getDynamicFields(request.body.id);
      reply.code(200).send(manga);
    } catch (err) {
      console.log(`manga error - ${chalk.red(err)}`);
    }
  }

  async mangaAppendMany(request, reply) {
    try {
      MangaService.mangaAppendService();
      reply.code(200).send({ msg: "72 records created" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  }

  async mangaAppendOne(request, reply) {
    try {
      const manga = request.body;
      manga.tags.forEach((item, i) => {
        manga.tags[i] = mongoose.Types.ObjectId(item);
      })
      await Manga.add(manga);
      reply.code(200).send({ msg: "manga was written" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  }
}

module.exports = new MangaController();
