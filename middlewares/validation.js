const { celebrate, Joi } = require('celebrate');
const isEmail = require('validator/lib/isEmail');
const BadRequestError = require('../errors/BadRequestError');
const { regexLink } = require('../constants/constants');

/* валидация электронной почты с помощью validator */
const validateEmail = (email) => {
  const isValid = isEmail(email);
  if (isValid) {
    return email;
  }
  throw new BadRequestError('Введен некорректный email');
};

/* валидация информации при изменении пользователя */
const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
});

/* валидация информациии при регистрации */
const registerValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(4),
    name: Joi.string().required().min(2).max(30),
  }),
});

/* валидация информации при авторизации */
const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail),
    password: Joi.string().required().min(4),
  }),
});

/* валидация добавления фильма */
const addMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexLink),
    trailerLink: Joi.string().required().pattern(regexLink),
    thumbnail: Joi.string().required().pattern(regexLink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

/* валидация id фильма */
const checkMovieIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().required().length(24),
  }),
});

module.exports = {
  updateUserValidation,
  registerValidation,
  loginValidation,
  addMovieValidation,
  checkMovieIdValidation,
};
