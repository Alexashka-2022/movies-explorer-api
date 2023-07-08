module.exports.serverError = (err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).send({ message: status === 500 ? 'Сервер передал ошибку' : message });
  next();
};
