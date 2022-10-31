const chalk = require("chalk");
const User = require("../models/User.model");
const Manga = require("../models/Manga.model");

const mangas = {
  title: "Title",
  cover: "Cover",
  artist: "Artist",
  series: "Series",
  tags: ["Simple", "Simple", "Simple", "Simple", "Simple", "Simple"],
  likes: 0,
  views: 0,
  cycle: {
    name: "CycleName",
    part: 1,
  },
};

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    reply.send("Привет");
  });

  fastify.get("/test", async (request, reply) => {
    reply.send({ hello: "world" });
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

  fastify.delete("/delete", async (request, reply) => {
    try {
      console.log("id", request.body.id);
      const { id } = request.body;
      await Manga.deleteOne({ _id: id });
      reply.code(200).send({ msg: "manga was deleted" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.get("/mangas", async (request, reply) => {
    try {
      const { page } = request.query;
      const step = 8;
      const offset = step * page;
      const total = await Manga.count();
      console.log(page);
      const mangas = await Manga.find({}).skip(offset).limit(8);
      reply
        .code(200)
        .send({ total: total, offset: offset, step: step, mangas: mangas });
    } catch (err) {
      console.log(err);
    }
  });

  // * Получение всех
  fastify.get("/get_paths", async (request, reply) => {
    try {
      const mangas = await Manga.find({}).select("_id");
      reply.code(200).send(mangas);
    } catch (err) {
      console.log(err);
    }
  });

  fastify.post("/manga", async (request, reply) => {
    try {
      const manga = await Manga.findById(request.body.id);
      reply.code(200).send(manga);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = routes;
