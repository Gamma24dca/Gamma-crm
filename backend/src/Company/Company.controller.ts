import { CompanyModel } from './Company.model';

export const CompanyController = {
  async getCompanies() {
    const companies = await CompanyModel.find().exec();
    return companies;
  },

  async getCompany(id) {
    const company = await CompanyModel.findById(id).exec();
    return company;
  },

  async addCompany(company) {
    await CompanyModel.validate(company);
    return await CompanyModel.create(company);
  },

  async updateCompany(id, companyBody) {
    return await CompanyModel.findByIdAndUpdate(id, companyBody);
  },

  async deleteCompany(id) {
    return await CompanyModel.findByIdAndDelete(id);
  },

  async addTeamMember(companyID, member) {
    const company = await CompanyController.getCompany(companyID);
    company.teamMembers.push(member);
    await CompanyController.updateCompany(companyID, company);
  },

  async deleteTeamMember(companyID, memberID) {
    const company = await CompanyController.getCompany(companyID);
    company.teamMembers = company.teamMembers.filter((member) => {
      member.workerID !== memberID;
    });
    await CompanyController.updateCompany(companyID, company);
    const updatedCompany = await CompanyController.getCompany(companyID);
    return updatedCompany.teamMembers;
  },
};
