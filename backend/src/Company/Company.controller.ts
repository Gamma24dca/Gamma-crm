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
      member._id !== memberID;
    });
    await CompanyController.updateCompany(companyID, company);
    const updatedCompany = await CompanyController.getCompany(companyID);
    return updatedCompany.teamMembers;
  },

  async companySearch(query) {
    const companies = await CompanyController.getCompanies();

    console.log(query);

    if (!query) {
      return companies;
    }

    const filteredCompanies = companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(query) ||
        company.phone.includes(query) ||
        company.mail.toLowerCase().includes(query) ||
        company.teamMembers.some(
          (member) =>
            member.name.toLowerCase().includes(query) ||
            member.lastname.toLowerCase().includes(query),
        )
      );
    });

    return filteredCompanies;
  },
};
