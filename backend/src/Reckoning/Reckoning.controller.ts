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
    const startDate = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
    const endDate = new Date(Date.UTC(Number(year), Number(month), 1));

    const tasks = await ReckoningTaskModel.find({
      participants: {
        $elemMatch: {
          _id: userId,
          isVisible: true,
          months: {
            $elemMatch: {
              createdAt: { $gte: startDate, $lt: endDate },
            },
          },
        },
      },
    }).exec();

    return tasks;
  },

  async addReckoningTask(taskData) {
    await ReckoningTaskModel.validate(taskData);
    const newReckoningTask = await ReckoningTaskModel.create(taskData);
    return newReckoningTask;
  },

  async addReckoningTaskFromKanban(taskData, userId, monthCreated) {
    const existingTask = await ReckoningTaskModel.findOne({
      searchID: taskData.searchID,
    }).exec();

    // Task does not exist, create a new one
    if (!existingTask) {
      await ReckoningTaskModel.validate(taskData);
      return ReckoningTaskModel.create(taskData);
    }

    const participant = existingTask.participants.find((p) => p._id === userId);
    if (!participant) return;

    const monthNumber = Number(monthCreated);
    const monthExists = participant.months.some(
      (month) => new Date(month.createdAt).getUTCMonth() + 1 === monthNumber,
    );

    const requestParticipant = taskData.participants.find(
      (p) => p._id === userId,
    );
    const requestMonth = requestParticipant?.months[0];

    if (monthExists && participant.isVisible) {
      // Month exists and participant is visible; nothing to do
      return { alreadyExist: true };
    }

    if (monthExists && !participant.isVisible) {
      // Month exists but participant is not visible; make participant visible
      participant.isVisible = true;
    }

    if (!monthExists && participant.isVisible) {
      // Month doesn't exist but participant is visible; add new month
      participant.months.push(requestMonth);
    }

    if (!monthExists && !participant.isVisible) {
      // Month doesn't exist and participant is not visible; replace months array and set visible
      participant.months = [requestMonth];
      participant.isVisible = true;
    }

    const updatedTask = await ReckoningTaskController.updateReckoningTask(
      existingTask._id,
      existingTask,
    );
    return updatedTask;
  },

  async updateReckoningTask(id, taskData) {
    const updatedReckoningTask = await ReckoningTaskModel.findByIdAndUpdate(
      id,
      taskData,
    );
    return updatedReckoningTask;
  },

  async deleteReckoningTask(id, userId, monthId) {
    const taskToDelete = await ReckoningTaskModel.findById(id).exec();

    const activeUsersCount = taskToDelete.participants.filter(
      (p) => p.isVisible,
    ).length;

    const paticipantOfTask = taskToDelete.participants.find((part) => {
      return part._id === userId;
    });

    const filterMonth = () => {
      paticipantOfTask.months = paticipantOfTask.months.filter((m) => {
        return String(m._id) !== monthId;
      });
    };

    if (activeUsersCount <= 1) {
      if (paticipantOfTask.months.length <= 1) {
        const deletedReckTask = await ReckoningTaskModel.findByIdAndDelete(id);
        return deletedReckTask;
      }

      filterMonth();

      await ReckoningTaskController.updateReckoningTask(
        taskToDelete._id,
        taskToDelete,
      );

      const updatedReckoTask =
        await ReckoningTaskController.getReckoningTask(id);

      return updatedReckoTask;
    } else {
      if (paticipantOfTask.months.length <= 1) {
        taskToDelete.participants = taskToDelete.participants.map((part) => {
          return part._id === userId && part.isVisible
            ? {
                ...part,
                months: part.months.map((m) => {
                  if (String(m._id) === monthId) {
                    return {
                      ...m,
                      hours: m.hours.map((h) => {
                        return h.hourNum > 0 ? { ...h, hourNum: 0 } : h;
                      }),
                    };
                  }
                  return m;
                }),
                isVisible: false,
              }
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
      filterMonth();

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
