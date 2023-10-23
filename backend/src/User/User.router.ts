import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController } from './User.controller';
import passport from 'passport';

const UserRouter = Router();

UserRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    try {
      const users = await UserController.getUsers();
      res.json(users);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  },
);

UserRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const user = await UserController.getUser(id);
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

UserRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const updatedUser = UserController.updateUser(id, {
        ...req.body,
      });
      res.status(StatusCodes.ACCEPTED).json(updatedUser);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

UserRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const user = UserController.deleteUser(id);
      res.status(StatusCodes.NO_CONTENT).json(user);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);
