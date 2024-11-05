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
        teamMembers: req.body.teamMembers,
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

CompanyRouter.post(
  '/:id/teamMembers',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const teamMember = await CompanyController.addTeamMember(req.params.id, {
        ...req.body,
      });
      res.status(StatusCodes.CREATED).json(teamMember);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.BAD_REQUEST).json({ error });
    }
  },
);

CompanyRouter.delete(
  '/:companyID/teamMembers/:workerID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const companyID = req.params.companyID;
      const workerID = req.params.workerID;
      await CompanyController.deleteTeamMember(companyID, workerID);
      res.status(StatusCodes.NO_CONTENT).json({});
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    }
  },
);

CompanyRouter.get(
  '/search/:query',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const query = req.params.query;
      if (!query) {
        const allCompanies = await CompanyController.getCompanies();
        res.json(allCompanies);
      }
      const searchResult = await CompanyController.companySearch(query);
      res.status(StatusCodes.ACCEPTED).json(searchResult);
    } catch (error) {
      res.status(StatusCodes.BAD_GATEWAY).json({ message: error });
    }
  },
);
