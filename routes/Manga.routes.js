const MangaController = require("../api/manga/Manga.controller");

async function MangaRoutes(fastify, options) {
  fastify.get("/mangas", MangaController.getAllMangas);

  fastify.get("/get_paths", MangaController.getMangasId);

  fastify.post("/write", MangaController.mangaAppendOne);

  fastify.post("/write-many", MangaController.mangaAppendMany);

  fastify.get("/manga-static", MangaController.getStatic);

  fastify.get("/manga-dynamic", MangaController.getDynamic);

  fastify.delete("/delete-one", MangaController.deleteMangaById);

  fastify.delete("/delete-many", MangaController.deleteMangaAll);

  fastify.get("/new_manga", MangaController.newMangas);
}

module.exports = MangaRoutes;
