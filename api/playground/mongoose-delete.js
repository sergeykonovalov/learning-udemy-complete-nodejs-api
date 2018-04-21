const { mongoose } = require('./../db/mongoose');
const { Todo } = require('./../models/todo');
const { ObjectID } = require('mongodb');

Todo.remove({}).then((result) => {
  console.log(result);
})

// Will delete and also return the document with removed data
Todo.findOneAndRemove.({}).then((result) => {
  console.log(result);
});

// If nothing is deleted, will return null
Todo.findByIdAndRemove(id).then((todo) => {
  console.log(result);
});
