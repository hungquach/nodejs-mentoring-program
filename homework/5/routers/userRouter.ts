import express from 'express';
import joi from 'joi';
import UserService from '../services/userService';
import Utils from '../services/utils';
import logger from '../logger';

const utils = new Utils();

const userRouter = express.Router();

// Services
const userService = new UserService();

const userSchema = joi.object().keys({
    id: joi.required(),
    login: joi.string().required(),
    password: joi.string().required().regex(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-zA-Z0-9]*$/),
    age: joi.number().integer().required().min(4).max(130),
    isDeleted: joi.bool().required(),
    groupIds: joi.array().required(),
})

userRouter.get('/users', async (req, res) => {
    try {
        const userEntities = await userService.getUsers();

        console.log('Get all users from DB', userEntities);

        const { order = 'asc' } = req.query

        return (order === 'asc') ? res.json(userEntities) : res.json(userEntities.reverse())

    } catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }
})

userRouter.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        console.log(`Get user by id ${id}`)

        const user = await userService.getUserById(id);

        if (user === undefined || user === null) {
            const message = `User with id ${id} not found`;
            console.error(message)
            res.status(404).json({ message: message })
        } else {
            console.log(`User with id ${id}: `, user)
            res.json(user)
        }
    } catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }
})

userRouter.get('/getAutoSuggestUsers', async (req, res) => {
    try {
        const userEntities = await userService.getUsers();
        console.log('Load users from DB to memory', userEntities);

        const { loginSubstring = '', limit = 10 } = req.query

        let filteredUsers = userEntities.filter(user => user.login.includes(loginSubstring as string)).sort((a: any, b: any) => b.login - a.login).slice(0, limit as number)

        return res.json(filteredUsers)
    } catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }
})

userRouter.post('/users', utils.validateSchema(userSchema), async (req, res) => {
    try {
        const user = req.body
        await userService.addUser(user);
        res.json({});

    } catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }
})

userRouter.put('/users/:id', utils.validateSchema(userSchema), async (req, res) => {
    try {
        const { id } = req.params
        let userReq = req.body;

        console.log(`Updating user with ${id}`)
        console.log('User request data: ', userReq)

        userReq.id = id;

        let user = userService.getUserById(id);
        if (user === undefined || user === null) {
            const message = `User with id ${id} not found`;
            console.error(message);
            res.status(404).json({ message: message });
        } else {
            await userService.updateUser(userReq);
            console.log(`Updated user with ${id}: `);
            res.json();
        }
    } catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }
})

userRouter.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        console.log(`Deleting user with ${id}`)

        let user = await userService.getUserById(id);
        if (user === undefined) {
            const message = `User with id ${id} not found`;
            console.error(message)
            res.status(404).json({ message: message })
        } else {
            userService.deleteUser(id);
            console.log(`Deleted user with ${id}: `)
            res.json()
        }
    } catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }
})

export default userRouter