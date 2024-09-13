require('dotenv').config();
const express = require('express');
import './Auth/Passport';
import fs from 'fs';
const mongoose = require('mongoose');
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { AuthRouter } from './Auth/Auth.router';
import { UserRouter } from './User/User.router';
import { TaskRouter } from './Tasks/Task.router';

const app = express();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database');
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.get('/', (req, res) => {
  res.send('Gamma mail API');
});
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/tasks', TaskRouter);
app.get('/api/status', (_, res) => res.status(200).json({ ok: true }));
