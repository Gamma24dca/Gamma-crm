import { ArchivedStudioTaskModel } from './ArchivedStudioTask.model';

export const ArchivedStudioTaskController = {
  async getArchivedStudioTasks() {
    const ArchivedStudioTasks = await ArchivedStudioTaskModel.find()
      .sort({ index: 1 })
      .exec();
    return ArchivedStudioTasks;
  },
  async getArchivedStudioTask(id) {
    const ArchivedStudioTask =
      await ArchivedStudioTaskModel.findById(id).exec();
    return ArchivedStudioTask;
  },
  async addArchivedStudioTask(ArchivedStudioTask) {
    await ArchivedStudioTaskModel.validate(ArchivedStudioTask);
    const newArchivedStudioTask =
      await ArchivedStudioTaskModel.create(ArchivedStudioTask);
    return newArchivedStudioTask;
  },

  async updateArchivedStudioTask(id, body) {
    const updatedArchivedStudioTask =
      await ArchivedStudioTaskModel.findByIdAndUpdate(id, body);

    return updatedArchivedStudioTask;
  },

  async deleteArchivedStudioTask(id) {
    return await ArchivedStudioTaskModel.findByIdAndDelete(id);
  },
};
