const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

let newUser = new User({
    email: "somebody@example.com"
});

newUser.save().then((doc) => {
    console.log(doc);
}, (error) => {
    console.log(error);
});

app.post('/todos', (req, res) => {
    let newTodo = new Todo({
        text: req.body.text,
        completed: true
    });
    newTodo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos, responseCode: 200, responseTexgt: "Ok" });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(8080, () => {
    console.log('Express server application started.');
});

module.exports = { app };