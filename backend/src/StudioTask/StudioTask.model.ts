import mongoose from 'mongoose';

export const StudioTaskModel = mongoose.model(
  'StudioTask',
  new mongoose.Schema({
    // Four random unic digits generated in front
    searchID: {
      type: Number,
      required: true,
    },
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
    // For Example Druk, Szwalnia, Mulimedia, social media
    TaskType: {
      type: String,
    },
    participants: {
      type: Array,
    },
    description: {
      type: String,
    },
    subtasks: [
      {
        content: { type: String },
      },
    ],
    deadline: {
      type: Date,
    },
  }),
);
