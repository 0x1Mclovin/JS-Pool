const jwt = require('jsonwebtoken');
const fp = require('fastify-plugin');

function signAccessToken(payload) {
	return jwt.sign(
		payload,
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
	)
}

function verifyAccessToken(token) {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function signRefreshToken(payload) {
	return jwt.sign(
		payload,
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
	)
}

function verifyRefreshToken(token) {
	console.log('\n\n' + token + '\n\n')
	const value = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
	return value
}

function jwtPlugin(fastify) {
	fastify.decorate('jwt', {
		signAccessToken,
		verifyAccessToken,
		signRefreshToken,
		verifyRefreshToken,
	})
}

module.exports = fp(jwtPlugin);
