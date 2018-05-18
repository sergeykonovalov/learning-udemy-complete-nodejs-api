const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: 'sergey@example.com',
        password: 'user1pass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'sergey@example.net',
        password: 'user2pass',
    }
];

let todos = [{
    _id: new ObjectID(),
    text: 'first test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333, // random number (actually a timestamp)
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'third test todo',
    _creator: userOneId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();
        return Promise.all([user1, user2]);
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };