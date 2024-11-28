const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { title, startTime, endTime, priority, status } = req.body;

        if (!title || !startTime || !endTime || !priority || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const task = new Task({
            title,
            startTime,
            endTime,
            priority,
            status,
            user: req.user.id,
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getTasks =  async (req, res) => {
    try {
        const { priority, status, sortBy, sortOrder } = req.query;
        console.log("user id is");
        console.log(req.user.id);

        const filter = { user: req.user.id };
        if (priority) filter.priority = priority;
        if (status) filter.status = status;

        const sort = {};
        if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const tasks = await Task.find(filter).sort(sort);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.updateTask = async (req, res) => {
    const { title, startTime, endTime, priority, status } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.title = title || task.title;
        task.startTime = startTime || task.startTime;
        task.endTime = endTime || task.endTime;
        task.priority = priority || task.priority;
        task.status = status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

exports.getStats = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === 'finished').length;
        const pendingTasks = totalTasks - completedTasks;

        res.json({
            totalTasks,
            completedPercentage: (completedTasks / totalTasks) * 100,
            pendingPercentage: (pendingTasks / totalTasks) * 100,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}