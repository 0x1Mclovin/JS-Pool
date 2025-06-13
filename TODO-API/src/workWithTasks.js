const fs = require("fs").promises;
const path = require("node:path");
const DATA_FILE_PATH = path.join(__dirname, '..', 'data', 'tasks.json');

async function readTasks() {
	const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
	return JSON.parse(data);
}

async function writeTasks(tasks) {
	await fs.writeFile(DATA_FILE_PATH, JSON.stringify(tasks, null, 2));
}

function validateTaskExists(tasks, id) {
	if (!tasks[id]) {
		throw new Error('Task not found');
	}
}

module.exports = {readTasks, writeTasks, validateTaskExists}
