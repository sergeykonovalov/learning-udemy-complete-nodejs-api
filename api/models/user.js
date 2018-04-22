const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

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

let User = mongoose.model('User', UserSchema);

module.exports = { User };
