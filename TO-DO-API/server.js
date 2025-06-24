const fastfiy = require('fastify')({logger: true})
const db = require('./db')

fastfiy.register(require('./routes/todos'))

const start = async () => {
	try {
		await fastfiy.listen({port: 3000, host: '0.0.0.0'});
		fastfiy.log.info('Server running at http://localhost:3000');
	} catch (error) {
		fastfiy.log.error(error);
		process.exit(1);
	}
};

start();
