const fastify = require("fastify")({ logger: true });

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Declare a route
fastify.get("/", async (request, reply) => {
	reply.send("Привет");
});

fastify.get("/test", async (request, reply) => {
	reply.send({ hello: "world" });
});

// Run the server!
const start = async () => {
	try {
		await fastify.listen({ port: PORT, host: HOST });
		console.log(`http://${HOST}:${PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
