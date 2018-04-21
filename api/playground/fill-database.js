const { mongoose } = require('./../db/mongoose');
const { Todo } = require('./../models/todo');
const { ObjectID } = require('mongodb');
let faker = require('faker');
let RECORD_MAX = 10000;

let counter = 0;
while( counter < RECORD_MAX) {
  let randomTodo = Todo({
    text: faker.hacker.phrase(),
    completed: faker.random.boolean()
  });
  randomTodo.save().then((res) => {
    console.log(res._id);
  }, (e) => {
    console.log(e);
  });
  counter++;
}
