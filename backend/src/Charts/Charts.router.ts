import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { ChartsController } from './Charts.controller';

export const ChartsRouter = Router();

ChartsRouter.get(
  '/reckoning/client-per-hour/:month/:year',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const month = req.params.month;
    const year = req.params.year;
    try {
      const result = await ChartsController.getClientsPerHour(month, year);
      res.status(StatusCodes.ACCEPTED).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },
);
