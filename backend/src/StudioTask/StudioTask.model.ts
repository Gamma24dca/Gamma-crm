import mongoose from 'mongoose';

export const StudioTaskModel = mongoose.model(
  'StudioTask',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    clientPerson: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
      // required: true,
    },
    participants: {
      type: Array,
    },
    description: {
      type: String,
      required: true,
    },
    subtasks: [
      {
        content: { type: String },
      },
    ],
    deadline: {
      type: Date,
      required: true,
    },
  }),
);
