require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { AuthRouter } from './Auth/Auth.router';
import { UserRouter } from './User/User.router';
import morgan from 'morgan';

const app = express();

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database');
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.get('/api/status', (_, res) => res.status(200).json({ ok: true }));
