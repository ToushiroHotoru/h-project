const chalk = require('chalk');
const Index = require('../controller/Index.controller');
const MangaController = require('../controller/Manga.controller');

async function routes(fastify, options) {
	fastify.get('/', Index.welcomePage);

	fastify.get('/mangas', MangaController.getAllMangas);

	fastify.get('/get_paths', MangaController.getMangasId);

	fastify.post('/write', MangaController.mangaAppendOne);

	fastify.post('/write-many', MangaController.mangaAppendMany);

	fastify.post('/manga-static', MangaController.getStatic);

	fastify.post('/manga-dynamic', MangaController.getDynamic);

	fastify.delete('/delete-one', MangaController.deleteMangaById);

	fastify.delete('/delete-many', MangaController.deleteMangaAll);
}

module.exports = routes;
