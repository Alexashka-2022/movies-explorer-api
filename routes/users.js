const usersRouter = require('express').Router();
const usersControllers = require('../controllers/users');
const userValidation = require('../middlewares/validation');

usersRouter.get('/me', usersControllers.getCurrentUser);
usersRouter.patch('/me', userValidation.updateUserValidation, usersControllers.updateUser);

module.exports = usersRouter;
