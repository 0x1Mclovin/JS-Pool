const { getUserById } = require('../models/user')

async function refreshRoute(fastify) {
	fastify.post('/refresh-token', async (req, reply) => {
		const {refreshToken} = req.cookies;
		if (!refreshToken)
			return reply.status(401).send({ error: 'Missing refresh token' });
		try {
			const payload = req.server.jwt.verifyRefreshToken(refreshToken);
			const user = await getUserById(payload.id);
			const newAccessToken = req.server.jwt.signAccessToken({id: user.id, username: user.username, email: user.email})
			return reply.send({accessToken: newAccessToken})
		} catch (error) {
			reply.status(403).send({ error: 'Invalid refresh token' });
		}
	})
}

module.exports = refreshRoute;
