import mongoose from 'mongoose';

export const ClientModel = mongoose.model(
  'Client',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    mail: {
      type: String,
      required: true,
    },
    activeTasks: {
      type: Number,
      required: true,
    },
  }),
);
