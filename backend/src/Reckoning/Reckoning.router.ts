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

ReckoningTaskRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newStudioTask = await ReckoningTaskController.addReckoningTask({
        searchID: req.body.searchID,
        client: req.body.client,
        clientPerson: req.body.clientPerson,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        taskType: req.body.taskType,
        printWhat: req.body.printWhat,
        printWhere: req.body.printWhere,
        participants: req.body.participants,
        startDate: req.body.startDate,
        deadline: req.body.deadline,
      });
      res.status(StatusCodes.CREATED).json(newStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ReckoningTaskRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedReckoningTask =
        await ReckoningTaskController.updateReckoningTask(req.params.id, {
          ...req.body,
        });
      res.status(StatusCodes.ACCEPTED).json(updatedReckoningTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ReckoningTaskRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await ReckoningTaskController.deleteReckoningTask(req.params.id);
      res.status(StatusCodes.ACCEPTED);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
