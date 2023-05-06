const mongoose1 = require('mongoose');

const TaskListSchema = new mongoose1.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3
    }
});

const TaskList = mongoose1.model('TaskList',TaskListSchema);

module.exports = TaskList;