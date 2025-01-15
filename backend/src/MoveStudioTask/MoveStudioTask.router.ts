import { Router } from 'express';
import passport from 'passport';
import { StudioTaskController } from '../StudioTask/StudioTask.controller';
import { ArchivedStudioTaskController } from '../ArchivedStudioTask/ArchivedStudioTask.controller';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';

export const MoveStudioTaskRouter = Router();

MoveStudioTaskRouter.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const sourceStudioTask = StudioTaskController.getStudioTask(
        req.params.id,
      );
      if (!sourceStudioTask) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Document not found' });
      }
      const targetStudioTask =
        await ArchivedStudioTaskController.addArchivedStudioTask(
          sourceStudioTask,
        );

      await StudioTaskController.deleteStudioTask(req.params.id);

      res.status(StatusCodes.CREATED).json(targetStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
