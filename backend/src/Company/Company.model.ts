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
          unique: true,
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
    ],
    activeTasks: {
      type: Number,
    },
  }),
);
