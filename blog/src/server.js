require('dotenv').config();
const fastify = require('fastify')({logger: true});


fastify.register(require('@fastify/cookie'));
fastify.register(require('./utils/jwtUtils'));

fastify.decorate('auth', async (req, reply) => {
	try {
		const authHeader = req.headers['authorization'];
		if (!authHeader) return reply.status(401).send({ error: 'Missing token' });
		const token = authHeader.split(' ')[1];
		const payload = fastify.jwt.verifyAccessToken(token);
		req.user = payload;
	} catch (err) {
		reply.code(401).send({ error: 'Unauthorized' });
	}
})


fastify.register(require('./routes/auth'), {prefix: '/auth'});
fastify.register(require('./routes/posts'), {prefix: '/'});
fastify.register(require('./routes/refresh'), {prefix: '/auth'});


const start = async () => {
	try {
		fastify.listen({port: process.env.PORT, host: process.env.HOST})
	} catch (err) {
		fastify.log.error(err);
		process.exit(1)
	}
}

start()
