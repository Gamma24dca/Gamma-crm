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
    TaskType: {
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
