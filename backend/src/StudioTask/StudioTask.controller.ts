import { StudioTaskModel } from './StudioTask.model';

export const StudioTaskController = {
  async getStudioTasks() {
    const studioTasks = await StudioTaskModel.find().exec();
    return studioTasks;
  },

  async getStudioTask(id) {
    const studioTask = StudioTaskModel.findById(id).exec();
    return studioTask;
  },

  async addStudioTask(body) {
    await StudioTaskModel.validate(body);
    const newStudioTask = await StudioTaskModel.create(body);
    return newStudioTask;
  },

  async updateStudioTask(id, body) {
    return await StudioTaskModel.findByIdAndUpdate(id, body);
  },

  async deleteStudioTask(id) {
    return await StudioTaskModel.findByIdAndDelete(id);
  },
};
