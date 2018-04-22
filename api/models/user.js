const mongoose = require('mongoose');

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
          validator: (value) => {
            // return true of validated, or false if not
          },
          message: '{VALUE} is not a valid email'
        }
    }
});

module.exports = { User };
