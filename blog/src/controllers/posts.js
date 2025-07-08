const {getPostsByUserId, createNewPost, getPostById} = require('../models/posts')

async function getPosts(req, reply) {
	try {
		const user_id = req.user.id;
		const posts = await getPostsByUserId(user_id);

		return reply.send({posts})
	} catch (error) {
		return reply.code(401).send({error: 'Failed to get posts'})
	}
}

async function createPost(req, reply) {
	try {
		const {title, content} = req.body;
		const user_id = req.user.id;
		const post_id = await createNewPost(user_id, title, content);
		reply.send({post_id, title});
	} catch (error) {
		return reply.code(401).send({error: 'Failed to create new post'})
	}
}

async function getPost(req, reply) {
	try {
		const {id} = req.params;
		const user_id = req.user.id;
		const post = await getPostById(user_id, id);
		return reply.send(post);
	} catch (error) {
		return reply.code(401).send({error: 'Failed to get post'});
	}
}

module.exports = {getPosts, createPost, getPost};


// console.log(`\n\n${}\n\n`);
