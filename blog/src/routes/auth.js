const {registerSch, loginSch} = require('../schemas/userSch');
const {register, login} = require('../controllers/auth')


async function authRoutes(fastify) {
	fastify.post('/register', { schema: registerSch }, register);
	fastify.post('/login', {schema: loginSch}, login);
}

module.exports = authRoutes;
