import { Router } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import { TaskController } from './Task.controller';
import '../Auth/Passport';
import { uploadImg } from '../lib/firebase';
import { multer } from '../lib/multer';

const upload = multer({ dest: 'uploads/' });

export const TaskRouter = Router();

TaskRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const tasks = await TaskController.getTasks();
      res.status(StatusCodes.ACCEPTED).json(tasks);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

TaskRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const task = await TaskController.getTask(req.params.id);
      res.status(StatusCodes.ACCEPTED).json(task);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

// TaskRouter.post(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   upload.single('image'),
//   async (req, res) => {
//     try {
//       const newTask = await TaskController.addTask({
//         // title: req.body.title,
//         // author: req.user.id,
//         // client: req.body.client,
//         // path: req.body.path,
//         description: req.body.description,
//         image: await uploadImg(req.file.path),
//         // date: new Date(),
//         // priority: req.body.priority,
//         // status: req.body.status,
//         // deadline: req.body.deadline,
//       });
//       res.status(StatusCodes.ACCEPTED).json(newTask);
//     } catch (error) {
//       if (error.name === 'ValidationError') {
//         res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
//       } else {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
//       }
//     }
//   },
// );

TaskRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('imgFile'),
  async (req, res) => {
    try {
      const newPost = await TaskController.addTask({
        title: req.body.title,
        author: req.user.id,
        client: req.body.client,
        path: req.body.path,
        description: req.body.description,
        image: await uploadImg(req.file.path),
        date: new Date(),
        priority: req.body.priority,
        status: req.body.status,
        deadline: req.body.deadline,
      });
      res.status(StatusCodes.ACCEPTED).json(newPost);
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }
    }
  },
);

TaskRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const updatedTask = await TaskController.updateTask(req.params.id, {
        ...req.body,
      });
      res.status(StatusCodes.ACCEPTED).json(updatedTask);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

// TaskRouter.post(
//   '/:id/subtasks',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       const newSubtask = await TaskController.addSubtask(req.params.id, {
//         content: req.body.content,
//       });
//       res.status(StatusCodes.ACCEPTED).json(newSubtask);
//     } catch (error) {
//       res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
//     }
//   },
// );

// TaskRouter.delete(
//   '/:taskID/subtasks/:subtaskID',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       await TaskController.deleteSubtask(
//         req.params.taskID,
//         req.params.subtaskID,
//       );
//       res.status(StatusCodes.NO_CONTENT).json({});
//     } catch (error) {
//       res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
//     }
//   },
// );

TaskRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const task = await TaskController.deleteTask(req.params.id);
      res.status(StatusCodes.NO_CONTENT).json(task);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);
