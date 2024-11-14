import mongoose from 'mongoose';
import { UserModel } from '../User/User.model';

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
      type: UserModel,
      required: true,
    },
    // For Example Druk, Szwalnia, Mulimedia, social media
    TaskType: {
      type: String,
    },
    participants: {
      type: [{ type: UserModel }],
    },
    description: {
      type: String,
    },
    subtasks: [
      {
        content: { type: String },
        done: { type: Boolean },
      },
    ],
    deadline: {
      type: Date,
    },
  }),
);
