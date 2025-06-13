
const taskValidator = {
	body: {
		type: 'object',
		additionalProperties: false,
		properties: {
			title: {type: 'string'},
			task: {type: 'string'},
			isCompleted: {type: 'boolean'}
		},
		required: ['title', 'task', 'isCompleted']
	}
};

const taskIDValidator = {
	params: {
		type: 'object',
		additionalProperties: false,
		properties: {
			id: {type: 'integer'}
		},
		required: ['id']
	}
}

const verifyTaskCompletion = {
	params: {
		type: 'object',
		properties: {
			id: {type: 'integer'}
		},
		required: ['id'],
		additionalProperties: false
	},
	body: {
		type: 'object',
		properties: {
			isCompleted: {type: 'boolean'}
		},
		required: ['isCompleted'],
		additionalProperties: false
	}
}

module.exports = {taskValidator, taskIDValidator, verifyTaskCompletion}
