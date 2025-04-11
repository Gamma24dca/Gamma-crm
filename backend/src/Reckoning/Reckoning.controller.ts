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

    const filteredReckoningTasks = reckoningTasks.filter((task) => {
      return task.participants.some((participant) => {
        if (participant._id !== userId || !participant.isVisible) {
          return false;
        }

        return participant.months.some((monthObj) => {
          const monthDate = new Date(monthObj.createdAt);
          return (
            monthDate.getFullYear() === Number(year) &&
            monthDate.getUTCMonth() + 1 === Number(month)
          );
        });
      });
    });

    return filteredReckoningTasks;
  },

  async addReckoningTask(taskData) {
    await ReckoningTaskModel.validate(taskData);
    const newReckoningTask = await ReckoningTaskModel.create(taskData);
    return newReckoningTask;
  },

  async addReckoningTaskFromKanban(taskData, userId, monthCreated) {
    const reckoningTasks = await ReckoningTaskModel.find().exec();

    const isAlreadyCreated = reckoningTasks.some(
      (obj) => obj.searchID === taskData.searchID,
    );

    if (isAlreadyCreated) {
      const filteredTask = reckoningTasks.find((task) => {
        return task.searchID === taskData.searchID;
      });

      const filteredParticipant = filteredTask.participants.find((part) => {
        return part._id === userId;
      });

      if (!filteredParticipant) return;

      const isThatMonthCreated = filteredTask.participants.some((part) => {
        return (
          part._id === userId &&
          part.months.some((month) => {
            return (
              new Date(month.createdAt).getUTCMonth() + 1 ===
              Number(monthCreated)
            );
          })
        );
      });

      if (isThatMonthCreated && filteredParticipant.isVisible) {
        return;
      } else if (isThatMonthCreated && !filteredParticipant.isVisible) {
        filteredTask.participants = filteredTask.participants.map((part) => {
          return part._id === userId
            ? {
                ...part,
                isVisible: true,
              }
            : part;
        });
        const updatedTask = await ReckoningTaskController.updateReckoningTask(
          filteredTask._id,
          filteredTask,
        );
        return updatedTask;
      } else if (!isThatMonthCreated && filteredParticipant.isVisible) {
        const filterRequestPart = taskData.participants.find((part) => {
          return part._id === userId;
        });

        filteredTask.participants = filteredTask.participants.map((part) => {
          return part._id === userId
            ? {
                ...part,
                isVisible: true,
                months: [...part.months, filterRequestPart.months[0]],
              }
            : part;
        });
        const updatedTask = await ReckoningTaskController.updateReckoningTask(
          filteredTask._id,
          filteredTask,
        );
        return updatedTask;
      } else if (!isThatMonthCreated && !filteredParticipant.isVisible) {
        const filterRequestPart = taskData.participants.find((part) => {
          return part._id === userId;
        });

        filteredTask.participants = filteredTask.participants.map((part) => {
          const updateMonth = {
            ...part.months[0],
            hours: filterRequestPart.months[0].createdAt,
            createdAt: filterRequestPart.months[0].createdAt,
          };
          return part._id === userId
            ? {
                ...part,
                isVisible: true,
                months: [updateMonth],
              }
            : part;
        });
        const updatedTask = await ReckoningTaskController.updateReckoningTask(
          filteredTask._id,
          filteredTask,
        );
        return updatedTask;
      }
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

  async deleteReckoningTask(id, userId) {
    const taskToDelete = await ReckoningTaskModel.findById(id).exec();

    const activeUsersCount = taskToDelete.participants.filter(
      (p) => p.isVisible,
    ).length;

    if (activeUsersCount <= 1) {
      const deletedReckTask = await ReckoningTaskModel.findByIdAndDelete(id);
      return deletedReckTask;
    } else {
      taskToDelete.participants = taskToDelete.participants.map((part) => {
        return part._id === userId && part.isVisible
          ? { ...part, isVisible: false }
          : part;
      });

      await ReckoningTaskController.updateReckoningTask(
        taskToDelete._id,
        taskToDelete,
      );
      const updatedReckoTask =
        await ReckoningTaskController.getReckoningTask(id);

      return updatedReckoTask;
    }
  },

  async updateDay(taskId, dayId, userId, value, month) {
    const task = await ReckoningTaskController.getReckoningTask(taskId);
    const filteredParticipant = task.participants.filter((user) => {
      return user._id === userId;
    });

    filteredParticipant[0].months = filteredParticipant[0].months.map(
      (monthObj) => {
        const monthDate = new Date(monthObj.createdAt);

        if (monthDate.getUTCMonth() + 1 === Number(month)) {
          const updatedHours = monthObj.hours.map((obj) => {
            return String(obj._id) === String(dayId)
              ? { ...obj, ...value }
              : obj;
          });

          return {
            ...monthObj,
            hours: updatedHours,
          };
        }

        return monthObj;
      },
    );

    // filteredParticipant[0].hours = filteredParticipant[0].hours.map((obj) => {
    //   return String(obj._id) === String(dayId) ? { ...obj, ...value } : obj;
    // });

    await ReckoningTaskController.updateReckoningTask(taskId, task);
    const updatedStudioTask =
      await ReckoningTaskController.getReckoningTask(taskId);
    return updatedStudioTask;
  },
};
