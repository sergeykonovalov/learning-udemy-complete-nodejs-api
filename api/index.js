const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let { ObjectID } = require('mongodb');

const app = express();

app.use(bodyParser.json());

// let newUser = new User({
//     email: "somebody@example.com"
// });
//
// newUser.save().then((doc) => {
//     console.log(doc);
// }, (error) => {
//     console.log(error);
// });

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
        res.send({ todos, responseCode: 200, responseText: "Ok" });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
  let todoId = req.params.id;
  if (!ObjectID.isValid(todoId)) {
    res.status(400).send({ responseText: `Bad ID ${todoId} provided`});
  }
  Todo.findById(todoId).then((todo) => {
    if (!todo) {
      res.status(404).send({ responseCode: 404, responseText: 'Not found'})
    };
    res.send({ todo, responseCode: 200, responseText: 'Ok' });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.delete('/todos/:id', (req, res) => {
  let todoId = req.params.id;
  if (!ObjectID.isValid(todoId)) {
    res.status(400).send({ responseText: `Bad ID ${todoId} provided`});
  }
  Todo.findByIdAndRemove(todoId).then((todo) => {
    if (!todo) {
      res.status(404).send();
    } else {
    res.status(200).send({ todo });
    }
  }, (e) => {
    res.status(400).send();
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(8080, () => {
    console.log('Express server application started.');
});

module.exports = { app };
