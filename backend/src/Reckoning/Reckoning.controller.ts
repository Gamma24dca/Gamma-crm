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
        taskDate.getFullYear() === Number(year) && TaskMonth === Number(month)
      );
    });

    const filteredReckoningTasks = filteredByDate.filter((task) => {
      return task.participants.some((part) => {
        return part._id === userId && part.isVisible;
      });
    });
    return filteredReckoningTasks;
  },

  async addReckoningTask(taskData) {
    await ReckoningTaskModel.validate(taskData);
    const newReckoningTask = await ReckoningTaskModel.create(taskData);
    return newReckoningTask;
  },

  async addReckoningTaskFromKanban(taskData, userId) {
    const reckoningTasks = await ReckoningTaskModel.find().exec();

    const isAlreadyCreated = reckoningTasks.some(
      (obj) => obj.searchID === taskData.searchID,
    );

    if (isAlreadyCreated) {
      const filteredTask = reckoningTasks.filter((task) => {
        return task.searchID === taskData.searchID;
      });

      filteredTask[0].participants = filteredTask[0].participants.map(
        (part) => {
          return part._id === userId ? { ...part, isVisible: true } : part;
        },
      );
      const updatedTask = await ReckoningTaskController.updateReckoningTask(
        filteredTask[0]._id,
        filteredTask[0],
      );
      return updatedTask;
    } else {
      await ReckoningTaskModel.validate(taskData);
      const newReckoningTaskFromKanban =
        await ReckoningTaskModel.create(taskData);
      return newReckoningTaskFromKanban;
    }
  },

  async updateReckoningTask(id, taskData) {
    const updatedReckoningTask = await ReckoningTaskModel.findByIdAndUpdate(
      id,
      taskData,
    );
    return updatedReckoningTask;
  },

  async deleteReckoningTask(id) {
    const deletedReckTask = await ReckoningTaskModel.findByIdAndDelete(id);
    return deletedReckTask;
  },

  async updateDay(taskId, dayId, userId, value) {
    const task = await ReckoningTaskController.getReckoningTask(taskId);
    const filteredParticipant = task.participants.filter((user) => {
      return user._id === userId;
    });
    filteredParticipant[0].hours = filteredParticipant[0].hours.map((obj) => {
      return String(obj._id) === String(dayId) ? { ...obj, ...value } : obj;
    });

    await ReckoningTaskController.updateReckoningTask(taskId, task);
    const updatedStudioTask =
      await ReckoningTaskController.getReckoningTask(taskId);
    return updatedStudioTask;
  },
};
