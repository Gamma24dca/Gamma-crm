import { Router } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';
import { ClientController } from './Client.controller';

export const ClientRouter = Router();

ClientRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const clients = await ClientController.getClients();
      res.status(StatusCodes.ACCEPTED).json(clients);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const client = await ClientController.getClient(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(client);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newClient = await ClientController.addClient({
        name: req.body.name,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
      });
      res.status(StatusCodes.ACCEPTED).json(newClient);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedCompany = await ClientController.updateClient(
        req.params.id,
        { ...req.body },
      );
      res.status(StatusCodes.ACCEPTED).json(updatedCompany);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

ClientRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deletedClient = await ClientController.deleteClient(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(deletedClient);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
