require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');

const app = express();

const { serverError } = require('./middlewares/serverError');
const router = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Соединение с MongoDB установлено успешно');
  }).catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cors);
app.use(limiter);
app.use(helmet());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(serverError);

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`);
});
