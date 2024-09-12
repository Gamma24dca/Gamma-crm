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

const allowedOrigins = 'https://gamma-crm-frontend.onrender.com';

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
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', [
    'https://gamma-crm-frontend.onrender.com',
    'http://localhost:5173',
  ]);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/tasks', TaskRouter);
app.get('/api/status', (_, res) => res.status(200).json({ ok: true }));
