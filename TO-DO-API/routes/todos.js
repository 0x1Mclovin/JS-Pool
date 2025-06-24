const db = require('../db')
const {todoSchema, todoIDSchema} = require('../schemas/todoSchemas')

async function routes(fastify, options) {

	// Creates a new TODO item
	fastify.post('/todos', {schema: todoSchema}, async (req, reply) => {
		try {
			const {title, description, completed=0} = req.body;
			const insertTodo = db.prepare(`
				INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)
			`);
			const info = insertTodo.run(title, description, completed);
			reply.code(201).send({ id: info.lastInsertRowid, title, description, completed });
		} catch (error) {
			reply.code(500).send({
				error: 'Database error',
				message: error.message
			})
		}
	});

	// Retrieves all TODO items
	fastify.get('/todos', async (req, reply) => {
		const getAllTodos = db.prepare(`SELECT * FROM todos`).all();
		reply.send(getAllTodos)
	});

	// Retrieves a TODO by ID
	fastify.get('/todos/:id', {schema: todoIDSchema}, async (req, reply) => {
		try {
			const {id} = req.params;
			const todo = db.prepare(`SELECT * FROM todos WHERE id = ?`).get(id);
			if (!todo) {
				return reply.code(404).send({ error: 'Todo not found' });
			}
			reply.code(200).send(todo);
		} catch (error) {
			reply.code(500).send({
				error: "Database error",
				message: error.message
			})
		}
	});

	// Updates a TODO by ID
	fastify.put('/todos/:id',{ schema: {
		params: todoIDSchema.params,
		body: todoSchema.body
	}}, async (req, reply) => {
		try {
			const {id} = req.params;
			const {title, description, completed=0} = req.body;
			const updateTODO = db.prepare(`
				UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?`
			);
			let info = updateTODO.run(title, description, completed, id);
			if (info.changes === 0) {
				reply.code(404).send({ error: 'TODO not found' });
			}
			reply.code(200).send({id, title, completed});
		} catch (error) {
			reply.code(500).send({
				error: 'Database error',
				message: error.message
			})
		}
	});

	// Deletes a TODO by ID
	fastify.delete('/todos/:id', {schema: todoIDSchema}, async (req, reply) => {
		try {
			const {id} = req.params;
			const deleteTODO = db.prepare('DELETE FROM todos WHERE id = ?');
			const info = deleteTODO.run(id);
			if (info.changes === 0) {
				reply.code(404).send({ error: 'TODO not found' });
			}
		} catch (error) {
			reply.code(500).send({
				error: 'Database error',
				message: error.message
			})
		}
	})
}

module.exports = routes

/*
	db.prepare(): Prepares SQL statements for safety (prevents SQL injection).
	stmt.run(): Executes INSERT, UPDATE, or DELETE queries.
	stmt.get(): Retrieves a single row.
	stmt.all(): Retrieves all rows.
*/
