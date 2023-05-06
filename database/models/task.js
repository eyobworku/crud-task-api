const mongoose1 = require('mongoose');

const TaskSchema = new mongoose1.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3
    },
    _taskListId:{
        type: mongoose1.Types.ObjectId,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    }
});

const Task = mongoose1.model('Task',TaskSchema);

module.exports = Task;