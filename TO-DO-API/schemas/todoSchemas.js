const todoSchema = {
	body: {
		type: 'object',
		properties: {
			title: {type: 'string', minLength: 3},
			description: {type: 'string'},
			completed: {type: 'number'}
		},
		required: ['title', 'description']
	}
};

const todoIDSchema = {
	params: {
		type: 'object',
		properties: {
			id: {type: 'number', minimum: 1}
		},
		required: ['id']
	}
};


module.exports = {todoSchema, todoIDSchema};
