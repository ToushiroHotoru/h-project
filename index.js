const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const chalk = require('chalk');

const PORT = process.env.PORT || 8080;
const HOST = process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0';

fastify.register(cors, {
	origin: true,
});

fastify.register(require('./plugins/mongoose.js'));
fastify.register(require('./api/routes.js'));

const start = async () => {
	try {
		await fastify.listen({ port: PORT, host: HOST });
		console.log(chalk.blue(`Server started - http://${HOST}:${PORT}`));
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
