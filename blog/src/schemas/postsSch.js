const postsSch = {
	body: {
		type: 'object',
		properties: {
			title: {type: 'string', minLength: 1},
			content: {type: 'string', minLength: 1}
		},
		required : ['title', 'content']
	}
}

const postIdSch = {
	params: {
		type: 'object',
		properties: {
			id: {type: 'number', minLength: 1}
		},
		required: ['id']
	}
}

module.exports = {postsSch, postIdSch}
