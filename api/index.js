const express = require('express');
const app = express();
let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let newUser = new User({
    email: "somebody@example.com"
});

newUser.save().then((doc) => {
    console.log(doc);
}, (error) => {
    console.log(error);
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