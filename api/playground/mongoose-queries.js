const { mongoose } = require('./../db/mongoose');
const { Todo } = require('./../models/todo');
const { ObjectID } = require('mongodb');

var id = '5ada59fb7bf68d36c5ce13f5';
if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
};
// var id = '6ada59fb7bf68d36c5ce13f5'; // valid, but missing
// var id = '5ada59fb7bf68d36c5ce13f51'; // invalid, causes 'Cast to ObjectId failed'

// Returns array or empty array
Todo.find({
  _id: id
}).then((todos) => console.log('.find', todos));

// Returns object or null
Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('.findOne', todo);
});

// Returns object or null
Todo.findById(id).then((todo) => {
  if (!todo) {
    return console.log('Id not found');
  }
  console.log('.findById', todo);
}).catch((e) => {
  console.log('Error: ', e);
});
