import mongoose from 'mongoose';

export const CompanyModel = mongoose.model(
  'Company',
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
    website: {
      type: String,
    },
    teamMembers: [
      {
        workerID: { type: String },
        name: { type: String },
        img: { type: String },
      },
    ],
    activeTasks: {
      type: Number,
    },
  }),
);
