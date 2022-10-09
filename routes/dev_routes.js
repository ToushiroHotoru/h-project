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

// const mangasArr = [];
// for (let i = 0; i < 22; i++) {}

async function routes(fastify, options) {
  fastify.get("/", async (request, reply) => {
    reply.send("Привет");
  });

  fastify.get("/test", async (request, reply) => {
    reply.send({ hello: "world" });
  });

  fastify.post("/write", async (request, reply) => {
    try {
      //   const manga = new Manga();
      for (let i = 0; i < 2; i++) {
        await Manga.add(mangas);
      }
      reply.code(200).send({ status: "success" });
    } catch (err) {
      console.log(`New user error - ${chalk.red(err)}`);
    }
  });

  fastify.get("/mangas", async (request, reply) => {
    const mangas = await Manga.find({});
    reply.code(200).send(mangas);
  });
}

module.exports = routes;
