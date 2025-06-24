const Database = require('better-sqlite3');
const db = new Database('./database/todos.db')

const query = `
	CREATE TABLE IF NOT EXISTS todos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL UNIQUE,
		description TEXT,
		completed BOOLEAN NOT NULL DEFAULT 0
	);
`;

db.exec(query)

module.exports = db
