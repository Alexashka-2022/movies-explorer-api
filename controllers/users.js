require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');

const userModel = require('../models/user');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  handleError,
} = require('../constants/constants');

const { NODE_ENV, JWT_SECRET = 'secret-key' } = process.env;

/* текущий пользователь */
const getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }

      return res.status(HTTP_STATUS_OK).send({ email: user.email, name: user.name });
    }).catch((err) => {
      handleError(err, next);
    });
};

/* регистрация пользователя */
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({
        name, email, password: hash,
      })
        .then((user) => {
          res.status(HTTP_STATUS_CREATED).send({
            _id: user._id,
            name: user.name,
            email: user.email,
          });
        }).catch((err) => {
          handleError(err, next);
        });
    }).catch(next);
};

/* изменение информации о пользователе */
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  userModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  ).then((user) => {
    res.status(HTTP_STATUS_OK).send(user);
  }).catch((err) => {
    handleError(err, next);
  });
};

/* авторизация пользователя */
const login = (req, res, next) => {
  const { email, password } = req.body;
  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.send({ token });
    }).catch(next);
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUser,
  login,
};
