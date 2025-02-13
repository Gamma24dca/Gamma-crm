import { Router } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';
import { ReckoningTaskController } from './Reckoning.controller';

export const ReckoningTaskRouter = Router();

ReckoningTaskRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reckoningTasks = await ReckoningTaskController.getReckoningTasks();
      res.status(StatusCodes.ACCEPTED).json(reckoningTasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ReckoningTaskRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const reckoningTask = await ReckoningTaskController.getReckoningTask(
        req.params.id,
      );
      res.status(StatusCodes.ACCEPTED).json(reckoningTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
