import express from 'express';
import joi from 'joi';
import Utils from '../services/utils';
import { passport } from '../config';
import UsersController from '../controllers/user';

const utils = new Utils();
const userRouter = express.Router();

const userSchema = joi.object().keys({
    id: joi.required(),
    login: joi.string().required(),
    password: joi.string().required().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-zA-Z0-9]*$/),
    age: joi.number().integer().required().min(4).max(130),
    isDeleted: joi.bool().required(),
    groupIds: joi.array().required(),
})

const loginSchema = joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
})

const usersController = new UsersController();

userRouter.post('/users/login', utils.validateSchema(loginSchema), usersController.login.bind(usersController));

userRouter.get('/users', passport.authenticate('jwt', { session: false }), usersController.getUsers.bind(usersController));

userRouter.get('/users/suggest', passport.authenticate('jwt', { session: false }), usersController.getSuggestions.bind(usersController));

userRouter.get('/users/:id', passport.authenticate('jwt', { session: false }), usersController.getUserDetail.bind(usersController));

userRouter.post('/users', passport.authenticate('jwt', { session: false }), utils.validateSchema(userSchema), usersController.createUser.bind(usersController));

userRouter.put('/users/:id', passport.authenticate('jwt', { session: false }), utils.validateSchema(userSchema), usersController.updateUser.bind(usersController));

userRouter.delete('/users/:id', passport.authenticate('jwt', { session: false }), usersController.deleteUser.bind(usersController));

export default userRouter