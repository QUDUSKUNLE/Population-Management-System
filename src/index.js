/* eslint-disable no-console */
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import expressValidator from 'express-validator';
import mongoose from 'mongoose';

import routes from './routes';


dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(require('morgan')('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());


// configure mongoose database
mongoose.promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.MONGODB_URL_TEST, {
    useCreateIndex: true,
    useNewUrlParser: true,
    autoReconnect: true,
  });
} else {
  mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    autoReconnect: true,
  });
}

app.use('/api/v1', routes);
app.get('/', (req, res) => res.status(200).json(
  { res: 'Population management system' },
));

app.listen(port, () => console.log(
  `Population management system is running on PORT ${port}`,
));

module.exports = app;
