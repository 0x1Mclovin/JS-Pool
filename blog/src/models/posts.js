const db = require('./db')

function getPostsByUserId(user_id) {
	const sql = `SELECT id, title, content FROM Posts WHERE user_id = ?`;
	return new Promise((resolve, reject) => {
		db.all(sql, [user_id], function (err, row) {
			if (err) reject(err);
			else resolve(row);
		})
	});
}

function createNewPost(user_id, title, content) {
	const sql = `INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)`;
	return new Promise((resolve, reject) => {
		db.run(sql, [user_id, title, content], function(err) {
			if (err) reject(err);
			else resolve(this.lastID);
		})
	})
}

function getPostById(user_id, id) {
	const sql = `SELECT id, title, content FROM Posts WHERE user_id = ? AND id = ?`;
	return new Promise((resolve, reject) => {
		db.get(sql, [user_id, id], function (err, row) {
			if (err) reject(err);
			else resolve(row);
		})
	})
}

module.exports = {getPostsByUserId, createNewPost, getPostById}
