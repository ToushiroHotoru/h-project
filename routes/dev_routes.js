const chalk = require("chalk");
const User = require("../models/User.model");
const Manga = require("../models/Manga.model");

const manga_template = {
  title: "Manga 7",
  cover: "/manga_cover/cover_7.jpg",
  artist: "Toushiro",
  series: "Toushiro's saga",
  tags: ["pagination", "lero"],
  likes: 999,
  views: 9999,
  cycle: {
    name: "Neverland",
    part: 1,
  },
  pages: [
    "/test_manga_storage/1.jpg",
    "/test_manga_storage/2.jpg",
    "/test_manga_storage/3.jpg",
    "/test_manga_storage/4.jpg",
    "/test_manga_storage/5.jpg",
    "/test_manga_storage/6.jpg",
    "/test_manga_storage/7.jpg",
    "/test_manga_storage/8.jpg",
    "/test_manga_storage/9.jpg",
    "/test_manga_storage/10.jpg",
    "/test_manga_storage/11.jpg",
    "/test_manga_storage/12.jpg",
    "/test_manga_storage/13.jpg",
    "/test_manga_storage/14.jpg",
    "/test_manga_storage/15.jpg",
    "/test_manga_storage/16.jpg",
    "/test_manga_storage/17.jpg",
    "/test_manga_storage/18.jpg",
    "/test_manga_storage/19.jpg",
    "/test_manga_storage/20.jpg",
    "/test_manga_storage/21.jpg",
    "/test_manga_storage/22.jpg",
    "/test_manga_storage/23.jpg",
    "/test_manga_storage/24.jpg",
  ],
};

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    reply.send("Привет");
  });

  fastify.get("/test", async (request, reply) => {
    reply.send({ hello: "world" });
  });

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  fastify.post("/write-many", async (request, reply) => {
    try {
      for (let i = 0; i < 72; i++) {
        await Manga.add({
          title: `Manga ${i + 1}`,
          cover: `/manga_cover/cover_${getRandomInt(7) + 1}.jpg`,
          artist: "Toushiro",
          series: "Toushiro's saga",
          tags: ["pagination", "lero"],
          likes: 999,
          views: 9999,
          cycle: {
            name: "Neverland",
            part: 1,
          },
          pages: [
            "/test_manga_storage/1.jpg",
            "/test_manga_storage/2.jpg",
            "/test_manga_storage/3.jpg",
            "/test_manga_storage/4.jpg",
            "/test_manga_storage/5.jpg",
            "/test_manga_storage/6.jpg",
            "/test_manga_storage/7.jpg",
            "/test_manga_storage/8.jpg",
            "/test_manga_storage/9.jpg",
            "/test_manga_storage/10.jpg",
            "/test_manga_storage/11.jpg",
            "/test_manga_storage/12.jpg",
            "/test_manga_storage/13.jpg",
            "/test_manga_storage/14.jpg",
            "/test_manga_storage/15.jpg",
            "/test_manga_storage/16.jpg",
            "/test_manga_storage/17.jpg",
            "/test_manga_storage/18.jpg",
            "/test_manga_storage/19.jpg",
            "/test_manga_storage/20.jpg",
            "/test_manga_storage/21.jpg",
            "/test_manga_storage/22.jpg",
            "/test_manga_storage/23.jpg",
            "/test_manga_storage/24.jpg",
          ],
        });
      }
      reply.code(200).send({ msg: "72 records created" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.post("/write", async (request, reply) => {
    try {
      //   for (let i = 0; i < 2; i++) {
      await Manga.add(request.body);
      //   }
      reply.code(200).send({ msg: "manga was written" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.delete("/delete-one", async (request, reply) => {
    try {
      console.log("id", request.body.id);
      const { id } = request.body;
      await Manga.deleteOne({ _id: id });
      reply.code(200).send({ msg: "manga was deleted" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.delete("/delete-many", async (request, reply) => {
    try {
      console.log("id", request.body.id);
      const { id } = request.body;
      await Manga.deleteMany({});
      reply.code(200).send({ msg: "manga was deleted" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.get("/mangas", async (request, reply) => {
    try {
      const { page, sort } = request.query;
      const reg = new RegExp("^d+$");
      const step = 24;
      const offset = step * (page - 1);
      const total = await Manga.count();
      let mangas = null;

      if (!reg.test(page) || page - 1 < 0 || page - 1 > total / 24) {
        reply.status(500).send({ message: "задана не верная страница" });
      }

      switch (sort) {
        case "latest":
          mangas = await Manga.find({})
            .sort({ createdAt: "desc" })
            .skip(offset)
            .limit(step);
          break;
        case "alphabet":
          mangas = await Manga.find({})
            .collation({ locale: "en", strength: 2 })
            .sort({ title: 1 })
            .skip(offset)
            .limit(step);
          break;
        default:
          reply.status(500).send({ message: "такого типа сортировки нет" });
        // mangas = await Manga.find({})
        //   .sort({ createdAt: "desc" })
        //   .skip(offset)
        //   .limit(step);
      }

      reply
        .code(200)
        .send({ total: total, offset: offset, step: step, mangas: mangas });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  // * Получение всех
  fastify.get("/get_paths", async (request, reply) => {
    try {
      const mangas = await Manga.find({}).select("_id");
      reply.code(200).send(mangas);
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.post("/manga-static", async (request, reply) => {
    try {
      const manga = await Manga.findById(request.body.id).select([
        "title",
        "artist",
        "cycle",
      ]);
      reply.code(200).send(manga);
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.post("/manga-dynamic", async (request, reply) => {
    try {
      const manga = await Manga.findById(request.body.id).select([
        "-title",
        "-artist",
        "-cycle",
      ]);
      reply.code(200).send(manga);
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });
}

module.exports = routes;
