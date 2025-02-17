import mongoose from 'mongoose';

export const ReckoningTaskModel = mongoose.model(
  'ReckoningTask',
  new mongoose.Schema({
    searchID: {
      type: Number,
      required: true,
      unique: true,
    },

    client: {
      type: String,
      required: true,
    },
    clientPerson: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    author: {
      _id: {
        type: String,
      },
      name: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: Number,
      },
      password: {
        type: String,
      },
      job: {
        type: String,
      },
      img: {
        type: String,
      },
    },
    // For Example Druk, Szwalnia, Mulimedia, social media
    taskType: {
      type: String,
    },

    printWhat: {
      type: String,
    },

    printWhere: {
      type: String,
    },

    participants: [
      {
        _id: {
          type: String,
        },
        // if one user adds task from kanban all assigned users gets fetched to participants but only user that added task to reckoning has isVisible to true and rest is false that other users can decide if they want to see this task from kanban in their reckoning
        isVisible: Boolean,
        name: {
          type: String,
        },
        hours: [{ hourNum: Number, isWeekend: Boolean }],
      },
    ],

    startDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: String,
    },
  }),
);
