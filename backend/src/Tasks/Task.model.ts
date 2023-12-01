import mongoose from 'mongoose';

export const TaskModel = mongoose.model(
  'Task',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    subtasks: [
      {
        content: { type: String },
      },
    ],

    status: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    participants: {
      type: Array,
    },
  }),
);
