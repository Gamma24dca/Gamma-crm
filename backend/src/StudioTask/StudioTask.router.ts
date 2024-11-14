import { Router } from 'express';
import passport from 'passport';
import { StudioTaskController } from './StudioTask.controller';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';

export const StudioTaskRouter = Router();

StudioTaskRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const studioTasks = await StudioTaskController.getStudioTasks();
      res.status(StatusCodes.ACCEPTED).json(studioTasks);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const studioTask = StudioTaskController.getStudioTask(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(studioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

StudioTaskRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newStudioTask = await StudioTaskController.addStudioTask({
        searchID: req.body.searchID,
        title: req.body.title,
        client: req.body.client,
        clientPerson: req.body.clientPerson,
        status: req.body.status,
        author: req.body.author,
        taskType: req.body.taskType,
        participants: req.body.participants,
        description: req.body.description,
        subtasks: req.body.subtasks,
        deadline: req.body.deadline,
      });
      res.status(StatusCodes.ACCEPTED).json(newStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
