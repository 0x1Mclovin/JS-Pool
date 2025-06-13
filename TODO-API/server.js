const fastify = require("fastify")({logger: true})

fastify.register(require("./routes/route"))

const start = async () => {
	try {
		await fastify.listen({port: 3000});
		console.log("Server running on port 3000");
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

start()
