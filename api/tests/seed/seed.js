const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');

let todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333 // random number (actually a timestamp)
}, {
    _id: new ObjectID(),
    text: 'third test todo'
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = { todos, populateTodos };