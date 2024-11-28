const express = require('express');
const taskController = require('../controllers/taskControllers');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();
const Task = require('../models/Task');

// create a Task
router.post('/create', authMiddleware, taskController.createTask);

//get all tasks
router.get('/getTasks', authMiddleware, taskController.getTasks);

// update a task by ID
router.put('/:id', authMiddleware , taskController.updateTask);

// delete a task by ID
router.delete('/:id', authMiddleware ,taskController.deleteTask);

// get statistics
router.get('/stats', authMiddleware, taskController.getStats);

module.exports = router;