const {
  allMangasSchema,
  homePageMangasSchema,
  readerMangaPagesSchema,
} = require("./Manga.schema");
const MangaService = require("./Manga.service");

async function MangaRoutes(fastify, options) {
  // ! technical paths --------------
  fastify.post("/api/add_new_static_manga", MangaService.addNewMangasStatic);
  fastify.post("/api/write", MangaService.mangaAppendOne);
  fastify.post("/api/write-many", MangaService.mangaAppendMany);
  fastify.delete("/api/delete-one", MangaService.deleteMangaById);
  fastify.delete("/api/delete-many", MangaService.deleteMangaAll);
  // ! technical paths --------------

  fastify.get("/api/mangas", allMangasSchema, MangaService.getAllMangas);

  fastify.get("/api/manga-canonical-paths", MangaService.getMangasId);

  fastify.get("/api/manga-static", MangaService.getStatic);

  fastify.get("/api/manga-dynamic", MangaService.getDynamic);

  fastify.get(
    "/api/last-published-mangas",
    homePageMangasSchema,
    MangaService.lastPublishedMangas
  );

  fastify.get(
    "/api/last-most-viewed-mangas",
    homePageMangasSchema,
    MangaService.mostViewedOnLastWeekMangas
  );
  fastify.get(
    "/api/last-most-liked-mangas",
    homePageMangasSchema,
    MangaService.mostLikedOnLastWeekMangas
  );

  fastify.get(
    "/api/reader-manga-by-id",
    readerMangaPagesSchema,
    MangaService.getMangaPagesForReader
  );

  fastify.get("/api/update-mangas", MangaService.updateRoutes);
}

module.exports = MangaRoutes;
