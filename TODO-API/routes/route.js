const fastifyPlugin = require("fastify-plugin");
const {taskValidator, taskIDValidator, verifyTaskCompletion} = require("../schema/schemas")
const {readTasks, writeTasks, validateTaskExists} = require("../src/workWithTasks")

async function routes(fastify) {

	fastify.get("/tasks", async (req, reply) => {
		try {
			let dataObj = await readTasks()
			reply.send(dataObj);
		} catch (error) {
			fastify.log.error('Error reading tasks:', error);
			reply.status(500).send({ error: 'Failed to load tasks' });
		}
	});

	fastify.get("/tasks/:id", {schema: taskIDValidator} ,async (req, reply) => {
		try {
			let dataObj = await readTasks()
			let id = Number(req.params.id);
			validateTaskExists(dataObj, id)
			reply.send(dataObj[id])
		} catch (error) {
			if (error.message === 'Task not found') {
				reply.status(404).send({ error: error.message });
			} else {
				fastify.log.error('Error fetching task:', error);
				reply.status(500).send({ error: 'Failed to load task' });
			}
		}
	})

	fastify.post("/tasks", {schema: taskValidator, attachValidation: true }, async (req, reply) => {
		try {
			if (req.validationError) {
				return reply.status(400).send(req.validationError);
			}
			let dataObj = await readTasks()
			console.log("\n\nbug\n\n")
			const body = req.body;
			body.id = dataObj.length;
			dataObj.push(body);
			await writeTasks(dataObj);
			reply.code(201).send(body);
		} catch (error) {
			fastify.log.error('Error creating task:', error);
			reply.code(500).send({ error: 'Failed to save task' });
		}
	})

	fastify.put("/tasks/:id", {schema: taskValidator}, async (req, reply) => {
		try {
			let id = Number(req.params.id);
			let dataObj = await readTasks()
			validateTaskExists(dataObj, id)
			dataObj[id] = req.body;
			dataObj[id].id = id;
			await writeTasks(dataObj)
			reply.code(200).send(req.body);
		} catch (error) {
			if (error.message === 'Task not found') {
				reply.status(404).send({ error: error.message });
			} else {
				fastify.log.error('Error updating task:', error);
				reply.status(500).send({ error: 'Failed to update task' });
			}
		}
	})

	fastify.patch("/tasks/:id", {schema: verifyTaskCompletion}, async (req, reply) => {
		try {
			let id = Number(req.params.id);
			let dataObj = await readTasks()
			validateTaskExists(dataObj, id)
			dataObj[id].isCompleted = req.body.isCompleted;
			await writeTasks(dataObj)
			reply.code(200).send(req.body);
		} catch (error) {
			if (error.message === 'Task not found') {
				reply.status(404).send({ error: error.message });
			} else {
				fastify.log.error('Error updating task:', error);
				reply.status(500).send({ error: 'Failed to update task' });
			}
		}
	})

	fastify.delete("/tasks/:id", {schema: taskIDValidator},  async (req, reply) => {
		try {
			let id = Number(req.params.id);
			let dataObj = await readTasks()
			validateTaskExists(dataObj, id)
			console.log(dataObj.length)
			const updateData = dataObj.filter(task => task.id != id)
			console.log(updateData.length)
			await writeTasks(updateData)
			reply.code(200).send(`task ${req.params.id} removed`);
		} catch (error) {
			if (error.message === 'Task not found') {
				reply.status(404).send({ error: error.message });
			} else {
				fastify.log.error('Error updating task:', error);
				reply.status(500).send({ error: 'Failed to update task' });
			}
		}
	})

}

module.exports = fastifyPlugin(routes)
