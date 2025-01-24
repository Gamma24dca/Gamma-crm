import { randomUUID } from 'crypto';
import { StudioTaskModel } from './StudioTask.model';

export const StudioTaskController = {
  async getStudioTasks() {
    const studioTasks = await StudioTaskModel.find().sort({ index: 1 }).exec();
    return studioTasks;
  },

  async getStudioTask(id) {
    const studioTask = await StudioTaskModel.findById(id).exec();
    return studioTask;
  },

  async addStudioTask(studioTask) {
    await StudioTaskModel.validate(studioTask);
    return await StudioTaskModel.create(studioTask);
  },

  async updateStudioTask(id, body) {
    return await StudioTaskModel.findByIdAndUpdate(id, body);
  },

  async deleteStudioTask(id) {
    return await StudioTaskModel.findByIdAndDelete(id);
  },
  async addSubtask(taskId, subtask) {
    const task = await StudioTaskController.getStudioTask(taskId);
    task.subtasks.push({ ...subtask, _id: randomUUID() });
    await StudioTaskController.updateStudioTask(taskId, task);
    const updatedStudioTask = await StudioTaskController.getStudioTask(taskId);
    return updatedStudioTask.subtasks;
  },
  async updateSubtask(taskId, subtaskId, subtask) {
    const task = await StudioTaskController.getStudioTask(taskId);
    task.subtasks = task.subtasks.map((obj) => {
      return obj._id === subtaskId ? { ...obj, ...subtask } : obj;
    });

    await StudioTaskController.updateStudioTask(taskId, task);
    const updatedStudioTask = await StudioTaskController.getStudioTask(taskId);
    return updatedStudioTask.subtasks;
  },

  async deleteSubtask(taskId, subtaskId) {
    const task = await StudioTaskController.getStudioTask(taskId);
    task.subtasks = task.subtasks.filter((sub) => sub._id !== subtaskId);
    await StudioTaskController.updateStudioTask(taskId, task);
    const updatedStudioTask = await StudioTaskController.getStudioTask(taskId);
    return updatedStudioTask;
  },
};
