const express = require('express');
const app = express();
const mongoose = require('./database/mongoose',{userNewUriParser : true,useUnifiedTopology: true} );

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task'); 
// app.listen(3000, function() {
//     console.log("Server started on port 3000");
// });
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PATCH,DELETE');
    // res.setHeader('Access-Control-Allow-Headers','Origin','X-Requested-With,Content-Type, Accept');
    res.header('Access-Control-Allow-Headers','Content-Type');
    // res.setHeader('Access-Control-Allow-Credentials',true);
    next();//pass to nex midleware
});

app.use(express.json());//3rd party body parser

//routes
/*
TaskList - Create, Update, ReadTaskListById,ReadAllTask
*/
//routes endpoints for tasklist model
//get all task list
///tasklist
app.get('/tasklists',(req,res) => {
    //console.log("Hello man");
    TaskList.find({})
        .then((lists) => {
            res.status(201).send(lists);
        })
        .catch((error)=>{
            console.log(error);
            res.status(500);
        });
});
//get task list by id
app.get('/tasklists/:tasklistId',(req,res) => {
        let tasklistId = req.params.tasklistId;
        TaskList.find({_id: tasklistId})
            .then((tasklist)=>{
                res.status(200).send(tasklist);
            })
            .catch((error)=>{
                console.log(error);
                res.status(500);
            })
    }
);

app.post('/tasklists',(req,res) => {
    //console.log("Post Method");
    console.log(req.body);

    let taskListObj = {'title': req.body.title};
    TaskList(taskListObj).save()
        .then((taskList)=>{
            res.status(201).send(taskList);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });

});

app.put('/tasklists/:tasklistId',(req,res)=>{
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId},{ $set: req.body})
        .then((tasklist)=>{
            res.status(201).send(tasklist);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
});
//put is full update of object
app.patch('/tasklists/:tasklistId',(req,res)=>{
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId},{ $set: req.body})
        .then((taskList)=>{
            res.status(201).send(taskList);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
});

//delete by id
app.delete('/tasklists/:tasklistId',(req,res)=>{

    const deleteAllContainingTask = (taskList) => {
        Task.deleteMany({_taskListId: req.params.tasklistId})
            .then(()=>{return taskList})
            .catch((error) => {console.log(error)});
    };
    const responseTaskList = TaskList.findByIdAndDelete(req.params.tasklistId)
        .then((taskList)=>{
            deleteAllContainingTask(taskList);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
    res.status(201).send(responseTaskList);
});
//up to this task list related methods

//from now task methods
app.get('/tasklists/:tasklistId/tasks', (req,res)=>{
    Task.find({_taskListId: req.params.tasklistId})
        .then((tasks) => {
            res.status(200).send(tasks)
        })
        .catch((error) => {console.log(error)});
});
//create task inside a tasklist
app.post('/tasklists/:tasklistId/tasks',(req,res) => {
    //console.log("Post Method");
    console.log(req.body);

    let taskObj = {'title': req.body.title, '_taskListId': req.params.tasklistId};
    Task(taskObj).save()
        .then((task)=>{
            res.status(201).send(task);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });

});
//get one task
app.get('/tasklists/:tasklistId/tasks/:taskId', (req,res)=>{
    Task.findOne({_taskListId: req.params.tasklistId, _id: req.params.taskId})
        .then((task) => {
            res.status(200).send(task)
        })
        .catch((error) => {console.log(error)});
});
//update one task in 1 tasklist
app.patch('/tasklists/:tasklistId/tasks/:taskId',(req,res)=>{
    Task.findOneAndUpdate({ _taskListId: req.params.tasklistId, _id: req.params.taskId},{ $set: req.body})
        .then((task)=>{
            Task.findById(task._id)
                .then((taskById)=>{
                    res.status(201).send(taskById);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500);
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
});

//delete one task in 1 tasklist
app.delete('/tasklists/:tasklistId/tasks/:taskId',(req,res)=>{
    Task.findOneAndDelete({ _taskListId: req.params.tasklistId, _id: req.params.taskId})
        .then((task)=>{
            res.status(200).send(task);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
});


app.listen(3000, () => {
    console.log("Server started on port 33000");
});