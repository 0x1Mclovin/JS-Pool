const sqlite3 = require('sqlite3').verbose();
const path = require('path')

const databasePath = path.join(__dirname, '../../database', 'blogApp.db');

const db = new sqlite3.Database(databasePath, (err) => {
	if (err) {
		console.error('Could not connect to DB', err);
	} else {
		console.log('Connected to db');
	}
})

const UsersTable = `
	CREATE TABLE IF NOT EXISTS Users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT NOT NULL UNIQUE,
		username TEXT NOT NULL,
		password TEXT NOT NULL
	)
`

const PostsTable = `
	CREATE TABLE IF NOT EXISTS Posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER ,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		FOREIGN KEY (user_id) REFERENCES Users(id)
	)
`

db.serialize(()=> {
	db.run(UsersTable)
	db.run(PostsTable)
})


module.exports = db;
