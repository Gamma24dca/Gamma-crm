import { ReckoningTaskModel } from './Reckoning.model';

export const ReckoningTaskController = {
  async getReckoningTasks() {
    const reckoningTasks = await ReckoningTaskModel.find().exec();
    return reckoningTasks;
  },

  async getReckoningTask(id) {
    const reckoningTask = await ReckoningTaskModel.findById(id).exec();
    return reckoningTask;
  },

  async getFilteredReckoningTasks(userId, year, month) {
    const reckoningTasks = await ReckoningTaskModel.find().exec();
    const filteredByDate = reckoningTasks.filter((taskToFilter) => {
      const taskDate = new Date(taskToFilter.startDate);

      const TaskMonth = taskDate.getMonth();
      return (
        // month is a number not string
        taskDate.getFullYear() === Number(year) &&
        TaskMonth === Number(month - 1)
      );
    });

    const filteredReckoningTasks = filteredByDate.filter((task) => {
      return task.participants.some((part) => {
        return part._id === userId;
      });
    });
    return filteredReckoningTasks;
  },

  async addReckoningTask(taskData) {
    await ReckoningTaskModel.validate(taskData);
    const newReckoningTask = await ReckoningTaskModel.create(taskData);
    return newReckoningTask;
  },

  async updateReckoningTask(id, taskData) {
    const updatedReckoningTask = await ReckoningTaskModel.findByIdAndUpdate(
      id,
      taskData,
    );
    return updatedReckoningTask;
  },

  async deleteReckoningTask(id) {
    await ReckoningTaskModel.findByIdAndDelete(id);
  },
};
