const MangaController = require("./Manga.controller");

async function MangaRoutes(fastify, options) {
  fastify.get("/api/mangas", MangaController.getAllMangas);

  fastify.get("/api/get_paths", MangaController.getMangasId);

  fastify.post("/api/add_new_static_manga", MangaController.addNewMangasStatic);

  fastify.post("/api/write", MangaController.mangaAppendOne);

  fastify.post("/api/write-many", MangaController.mangaAppendMany);

  fastify.get("/api/manga-static", MangaController.getStatic);

  fastify.get("/api/manga-dynamic", MangaController.getDynamic);

  fastify.delete("/api/delete-one", MangaController.deleteMangaById);

  fastify.delete("/api/delete-many", MangaController.deleteMangaAll);

  fastify.get(
    "/api/last_published_mangas",
    MangaController.lastPublishedMangas
  );

  fastify.get(
    "/api/last_most_viewed_mangas",
    MangaController.mostViewedOnLastWeekMangas
  );
  fastify.get(
    "/api/last_most_liked_mangas",
    MangaController.mostLikedOnLastWeekMangas
  );

  fastify.get(
    "/api/reader-manga-by-id",
    MangaController.getMangaPagesForReader
  );
}

module.exports = MangaRoutes;
