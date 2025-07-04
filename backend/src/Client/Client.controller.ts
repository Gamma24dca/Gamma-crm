import { ClientModel } from './Client.model';

export const ClientController = {
  async getClients() {
    const clients = await ClientModel.find().exec();
    return clients;
  },

  async getClient(id) {
    const client = await ClientModel.findById(id).exec();
    return client;
  },

  async addClient(client) {
    await ClientModel.validate(client);
    return await ClientModel.create(client);
  },

  async addManyClients(clients) {
    const inserted = await ClientModel.insertMany(clients);
    return await inserted;
  },

  async updateClient(id, clientBody) {
    return await ClientModel.findByIdAndUpdate(id, clientBody);
  },

  async deleteClient(id) {
    return await ClientModel.findByIdAndDelete(id);
  },

  async getClientsPerCompany(company) {
    const clients = await ClientController.getClients();

    const filteredClients = clients.filter((client) => {
      return client.company.toLowerCase() === company;
    });

    return await filteredClients;
  },
};
