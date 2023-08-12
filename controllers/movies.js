const movieModel = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  handleError,
} = require('../constants/constants');

/* возвращает все сохранённые текущим пользователем фильмы */
const getMovies = (req, res, next) => {
  movieModel.find({ owner: req.user._id })
    .then((movies) => {
      res.status(HTTP_STATUS_OK).send(movies);
    }).catch(next);
};

/* добавляем фильм в список сохраненных */
const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  movieModel.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  }).then((movie) => {
    res.status(HTTP_STATUS_CREATED).send(movie);
  }).catch((err) => handleError(err, next));
};

const deleteMovie = (req, res, next) => {
  const userId = req.user._id;
    movieModel.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильма с таким _id не существует'));
      }
      if (movie.owner.toString() !== userId) {
        return next(new ForbiddenError('У вас недостаточно прав для удаления этого фильма'));
      }
      return movie.deleteOne().then(() => res.send({ message: 'Фильм успешно удален' }));
    }).catch((err) => handleError(err, next));
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
