const { mongoose } = require('./../db/mongoose');
const { User } = require('./../models/user');
const { ObjectID } = require('mongodb');

let userId = '5ada59fb7bf68d36c5ce13ea';

if (ObjectID.isValid(userId)) {
  User.findById(userId).then((user) => {
    if (user) {
      console.log(JSON.stringify(user, undefined, 2));
    } else {
      console.log('No user');
    }
  }).catch((e) => console.log(e));
} else {
  console.log('ID is not valid');
};
