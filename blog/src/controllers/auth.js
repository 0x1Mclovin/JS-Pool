const bcrypt = require('bcrypt');
const {createUser, getUserByEmail} = require('../models/user');

async function register(req, reply) {
	try {

		const {email, username, password} = req.body;
		const hashed = await bcrypt.hash(password, 10)
		const id = await createUser(email, username, hashed);

		return reply.send({id, username, email})
	} catch (error) {
		return reply.code(400).send({error: 'Email already exists'})
	}
}

async function login(req, reply, fastify) {
	try {

		const {email, password} = req.body;
		const user = await getUserByEmail(email);
		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			return reply.code(401).send({error: 'Invalid email or password'})
		}

		const accessToken = req.server.jwt.signAccessToken(
			{id: user.id, username: user.username, email: user.email}
		)

		const refreshToken = req.server.jwt.signRefreshToken(
			{id: user.id}
		);

		return reply.setCookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false, // TODO: set true in production with HTTPS
			sameSite: 'strict',
			path: '/',
			maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
		}).send({accessToken});
	} catch (error) {
		console.error(error)
		return reply.code(400).send({error: 'Invalid email or password'})
	}
}

module.exports = {register, login};
