import { StatusCodes } from 'http-status-codes';
import { Router } from 'express';
import { AuthController } from './Auth.controller';

export const AuthRouter = Router();

AuthRouter.post('/signin', async (req, res) => {
  try {
    const { email, password, grantType } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'email and password are required' });
      return;
    }

    const token = await AuthController.signUser(email, password);
    if (token === null) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
      return;
    }
    if (grantType && grantType === 'cookie') {
      res
        .status(StatusCodes.OK)
        .cookie('token', token, {
          httpOnly: true,
          secure: true,
          signed: true,
          maxAge: 1000 * 60 * 60,
        })
        .end();
    } else {
      res.status(StatusCodes.OK).json({ token });
    }
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
});

AuthRouter.post('/signup', async (req, res) => {
  try {
    const newUser = AuthController.addUser(req.body);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: error.message } });
  }
});
