const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    validate: {
      validator(v) {
        return /[\w.-]+@[\w.-]+\.[a-z]{2,3}/.test(v);
      },
      message: 'E-Mail некорректен',
    },
    required: true,
    unique: true,
    default: 'Почта',
  },
  password: {
    type: String,
    required: true,
    select: false,
    default: 'Пароль',
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Имя',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
