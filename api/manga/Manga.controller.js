const MangaService = require("./Manga.service");

async function MangaRoutes(fastify, options) {
  fastify.get("/api/mangas", MangaService.getAllMangas);

  fastify.get("/api/get_paths", MangaService.getMangasId);

  fastify.post("/api/add_new_static_manga", MangaService.addNewMangasStatic);

  fastify.post("/api/write", MangaService.mangaAppendOne);

  fastify.post("/api/write-many", MangaService.mangaAppendMany);

  fastify.get("/api/manga-static", MangaService.getStatic);

  fastify.get("/api/manga-dynamic", MangaService.getDynamic);

  fastify.delete("/api/delete-one", MangaService.deleteMangaById);

  fastify.delete("/api/delete-many", MangaService.deleteMangaAll);

  fastify.get(
    "/api/last_published_mangas",
    MangaService.lastPublishedMangas
  );

  fastify.get(
    "/api/last_most_viewed_mangas",
    MangaService.mostViewedOnLastWeekMangas
  );
  fastify.get(
    "/api/last_most_liked_mangas",
    MangaService.mostLikedOnLastWeekMangas
  );

  fastify.get(
    "/api/reader-manga-by-id",
    MangaService.getMangaPagesForReader
  );
}

module.exports = MangaRoutes;
