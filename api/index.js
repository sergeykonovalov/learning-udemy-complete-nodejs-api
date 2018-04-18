const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

let newTodo = new Todo({
    text: "Cook dinner",
    completed: true,
    completedAt: 31081982
});

newTodo.save().then((doc) => {
    console.log('Saved Todo', doc);
}, (error) => {
    console.log('Unable to save Todo', error)
});

app.get('/', function (req, res) {
    res.send('Hello world');
});

app.listen(8080, function() {
    console.log('Express server application started.');
});