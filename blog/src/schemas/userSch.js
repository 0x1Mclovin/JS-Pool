const registerSch = {
	body: {
		type: 'object',
		properties: {
			email: {type: 'string', format: 'email', minLength: 4},
			username: {type: 'string', minLength: 2},
			password: {type: 'string', minLength: 8}
		},
		required: ['email', 'username', 'password']
	}
}


const loginSch = {
	type: 'object',
	properties: {
		email: {type: 'string', format: 'email', minLength: 4},
		password: {type: 'string', minLength: 8}
	},
	required: ['email', 'password']
}

module.exports = {registerSch, loginSch};
