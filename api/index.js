require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');
let { ObjectID } = require('mongodb');
let { authenticate } = require('./middleware/authenticate');

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

app.patch('/todos/:id', (req, res) => {
  let todoId = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(todoId)) {
    res.status(400).send({ responseText: `Bad ID ${todoId} provided`});
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(todoId, { $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({ todo });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/users', (req, res) => {
  let requestBody = _.pick(req.body, ['email', 'password']); // only work with properties we want, not all sent by user
  let newUser = new User(requestBody);
  
  newUser.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    console.log('=== APP - Received Token ===\n', token);
    console.log('=== APP - User Model Now ===\n', newUser);
    res.header('x-auth', token).send(newUser);
  }).catch((e) => {
    console.log('=== APP - Error Triggered ===\n', e);
    if (e.code === 11000) {
      res.status(409).send({ message: 'Conflict of data' });
    }
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(process.env.PORT = 3000, () => {
    console.log(`Express server application started on port ${process.env.PORT}`);
});

module.exports = { app };
