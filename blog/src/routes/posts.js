const {postsSch, postIdSch} = require('../schemas/postsSch');
const {getPosts, createPost, getPost} = require('../controllers/posts')

async function postsRoute(fastify) {
	fastify.get('/posts',{preHandler: fastify.auth}, getPosts);
	fastify.get('/posts/:id', {preHandler: fastify.auth, schema: postIdSch}, getPost)
	fastify.post('/posts',{preHandler: fastify.auth, schema: postsSch} ,createPost);
}


module.exports = postsRoute;
