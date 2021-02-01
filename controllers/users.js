require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauth-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: { Email: `${user.email}`, Имя: `${user.name}` } }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  if (password.length < 8 || password.trim().length === 0) {
    throw new BadRequestError('Некорректный пароль');
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => {
      res.status(200).send({
        data: {
          name, email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else if (err.code === 11000) {
        next(new ConflictError('E-Mail уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      return res.status(201).cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
