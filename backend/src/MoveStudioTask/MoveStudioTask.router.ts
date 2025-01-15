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
      const sourceStudioTask = await StudioTaskController.getStudioTask(
        req.params.id,
      );
      console.log('SOURCE TASK!!!:', sourceStudioTask);
      if (!sourceStudioTask) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Document not found' });
      }
      const targetStudioTask =
        await ArchivedStudioTaskController.addArchivedStudioTask({
          ...sourceStudioTask.toObject(), // Convert to plain object to avoid model-related issues
          __v: undefined, // Remove version field to prevent conflicts
        });

      await StudioTaskController.deleteStudioTask(req.params.id);

      res.status(StatusCodes.CREATED).json(targetStudioTask);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
