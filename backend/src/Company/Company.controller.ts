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
};
