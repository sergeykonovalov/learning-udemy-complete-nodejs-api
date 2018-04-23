const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
},
password: {
  type: String,
  require: true,
  minlength: 6
},
tokens: [{
  access: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
}]
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

// We will use `function` to bind to `this`
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  console.log('=== MODEL - Original User ===\n', user);
  let access = 'auth';
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
  console.log('=== MODEL - Original User Tokens ===\n', user.tokens);
  console.log('=== MODEL - Signed Token ===\n', token);
  try { 
    user.tokens = user.tokens.concat([{ access, token }]);
  } catch(e) {
    console.log('=== MODEL - Error With Array ===\n', e);
  }
  console.log('=== MODEL - Updated User Tokens ===\n', user.tokens);
  console.log('=== MODEL - Updated User Model ===\n', user);
  return user.save().then(() => {
    console.log('=== MODEL - Token We Will Now Return ===\n', token);
    return token;
  }).catch((e) => {
    console.log('=== MODEL - Error On Model Save ===\n', e);
  });
};

// Define model method, not instance method
UserSchema.statics.findByToken = function (token) {
  console.log('=== MODEL - Entry ===\n');
  let User = this;
  console.log('=== MODEL - User Model ===\n', User);
  let decoded;
  console.log('=== MODEL - Received Token ===\n', token);
  try {
    decoded = jwt.verify(token, 'abc123');
    console.log('=== MODEL - Decoded Token ===\n', decoded);
  } catch(e) {
    console.log('=== MODEL - Error Verifying Token  ===\n', e);
    // return new Promise((resolve, reject) => {
    //   reject();
    return Promise.reject('Could not verify the JWT');
    };
    
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
  });
};

let User = mongoose.model('User', UserSchema);

module.exports = { User };
