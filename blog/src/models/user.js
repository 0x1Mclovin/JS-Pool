const db = require('./db')

function createUser (email, username, password) {
	const sql = `INSERT INTO Users (email, username, password) VALUES (?, ?, ?)`;
	return new Promise((resolve, reject) => {
		db.run(sql, [email, username, password], function (err) {
			if (err) reject(err);
			else{
				resolve(this.lastID);
			}
		} )
	})
}

function getUserByEmail(email) {
	const sql = 'SELECT * FROM Users WHERE email = ?';
	return new Promise((resolve, reject) => {
		db.get(sql, [email], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		})
	})
}

function getUserById(id) {
	const sql = 'SELECT id, username, email  FROM Users WHERE id = ?';
	return new Promise((resolve, reject) => {
		db.get(sql, [id], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		})
	})
}

module.exports = { createUser, getUserByEmail, getUserById };
