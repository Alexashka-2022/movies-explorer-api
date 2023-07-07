const moviesRouter = require('express').Router();
const moviesControllers = require('../controllers/movies');
const moviesValidation = require('../middlewares/validation');

moviesRouter.get('/', moviesControllers.getMovies);
moviesRouter.post('/', moviesValidation.addMovieValidation, moviesControllers.addMovie);
moviesRouter.delete('/:_id', moviesValidation.checkMovieIdValidation, moviesControllers.deleteMovie);

module.exports = moviesRouter;
