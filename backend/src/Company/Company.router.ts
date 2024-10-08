import { Router } from 'express';
import passport from 'passport';
import { CompanyController } from './Company.controller';
import { StatusCodes } from 'http-status-codes';
import '../Auth/Passport';

export const CompanyRouter = Router();

CompanyRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const companies = await CompanyController.getCompanies();
      res.status(StatusCodes.ACCEPTED).json(companies);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const company = await CompanyController.getCompany(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(company);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newCompany = await CompanyController.addCompany({
        name: req.body.name,
        phone: req.body.phone,
        mail: req.body.mail,
        website: req.body.website,
        activeTasks: req.body.activeTasks,
      });
      res.status(StatusCodes.ACCEPTED).json(newCompany);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedCompany = await CompanyController.updateCompany(
        req.params.id,
        { ...req.body },
      );
      res.status(StatusCodes.ACCEPTED).json(updatedCompany);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const deletedTask = await CompanyController.deleteCompany(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(deletedTask);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);
