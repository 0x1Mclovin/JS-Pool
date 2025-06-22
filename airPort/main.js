const database = require('better-sqlite3');
const fastify = require('fastify')({logger: true});
const db = database('airPort.db');
const postSchema = {
	body: {
		type: 'object',
		properties: {
			username: {type: 'string', minLength: 3},
			email: {type: 'string', minLength: 3, format: 'email'},
			passport_number: {type: 'string', minLength: 3},
		},
		required: ['username', 'email', 'passport_number']
	}
}
const idSchema = {
	params: {
		type: 'object',
		properties: {
			id: {type: 'integer', minimum: 1},
		},
		required: ['id'],
	}
}

const query = `
	CREATE TABLE IF NOT EXISTS Persons (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE
	);

	CREATE TABLE IF NOT EXISTS Passports (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		passport_number TEXT NOT NULL UNIQUE,
		person_id INTEGER UNIQUE,
		FOREIGN KEY (person_id) REFERENCES Persons(id)
	);
`

db.exec(query);


fastify.post('/airport', {schema: postSchema}, async (req, reply) => {
	try {
		const {username, email, passport_number} = req.body;
		const student = db.prepare('INSERT INTO Persons (username, email) VALUES (?, ?)');
		const info = student.run(username, email);
		const person_id = info.lastInsertRowid;
		const passport = db.prepare('INSERT INTO Passports (passport_number, person_id) VALUES (?, ?)');
		passport.run(passport_number, person_id);
		reply.code(201).send({id: info.lastInsertRowid, username, email})
	} catch (error) {
		reply.code(500).send({error: 'Database error', msg: error.message});
	}
});

fastify.get('/airport', async (req, reply) => {
	try {
		const query = `
			SELECT persons.id, persons.username, persons.email, passport_number
			FROM Persons LEFT JOIN Passports ON persons.id = passports.person_id
		`;
		const persons = db.prepare(query);
		const result = persons.all();
		reply.code(200).send(result)
	} catch (error) {
		reply.code(500).send({error: 'Database error', msg: error.message});
	}
});

fastify.get('/airport/:id', {schema: idSchema}, async (req, reply) => {
	const id = Number(req.params.id);
	const query = `
		SELECT persons.username, persons.email, passport_number
		FROM Persons JOIN Passports ON persons.id = passports.person_id WHERE persons.id = (?)
	`
	const person = db.prepare(query).get(id);
	reply.code(200).send(person);
});

fastify.put('/airport/:id', {schema: postSchema, idSchema}, async (req, reply) => {
	try {
		const id = Number(req.params.id);
		console.log("\n\n" + id)
		const {username, email, passport_number} = req.body;
		const query1 = `
			UPDATE Persons SET username = ?, email = ? WHERE id = ?
		`;
		const person = db.prepare(query1);
		person.run(username, email, id);
		const query2 = `
			UPDATE Passports SET passport_number = ? WHERE id = ?
		`;
		const passport = db.prepare(query2);
		passport.run(passport_number, id);
		reply.status(201).send({id, message: "Updated successfully"})
	} catch (err) {
		reply.code(500).send({error: "Database error", msg: err})
	}
});

fastify.delete('/airport/:id', {schema: idSchema}, async (req, reply) => {
	try {
		const id = Number(req.params.id);
		const query1 = `
			DELETE FROM Passports WHERE  id = ?
		`;
		const passport = db.prepare(query1);
		passport.run(id);
		const query2 = `
			DELETE FROM Persons WHERE  id = ?
		`;
		const person = db.prepare(query2);
		person.run(id);
		reply.code(204).send()
	} catch (err) {
		reply.code(500).send({error: "Database error", msg: err})
	}
});


const start = async () => {
	try {
		await fastify.listen({port: 3000, host: '0.0.0.0'});
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
}

start()
