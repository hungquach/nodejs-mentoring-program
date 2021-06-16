import { UserService } from "../services";
import express from 'express';
import { logger } from '../config';

export default class UsersController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { username, password } = req.body;
            logger.info("Generating jwt token");
            const token = await this.userService.generateJwtToken(username, password);

            logger.info("JWT token: " + token);
            res.json({
                token: token
            })
        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async getUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const users = await this.userService.getUsers();

            console.log('Get all users from DB', users);

            const { order = 'asc' } = req.query

            const response = users.map(user => ({
                id: user.id,
                login: user.login,
                password: user.password,
                age: user.age,
                isDeleted: user.isDeleted,
                groups: user.groups,
                groupIds: user.groupIds
            }));

            return (order === 'asc') ? res.json(response) : res.json(response.reverse())

        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async getSuggestions(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const userEntities = await this.userService.getUsers();
            console.log('Load users from DB to memory', userEntities);
    
            const { loginSubstring = '', limit = 10 } = req.query
    
            let response = userEntities
                .filter(user => user.login.includes(loginSubstring as string))
                .sort((a: any, b: any) => b.login - a.login)
                .slice(0, limit as number)
                .map(user => ({
                    id: user.id,
                    login: user.login,
                    password: user.password,
                    age: user.age,
                    isDeleted: user.isDeleted,
                    groups: user.groups,
                    groupIds: user.groupIds
                }));
    
            return res.json(response)
        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async getUserDetail(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params
            console.log(`Get user by id ${id}`)
    
            const user = await this.userService.getUserById(id);
    
            if (user === undefined || user === null) {
                const message = `User with id ${id} not found`;
                console.error(message)
                res.status(404).json({ message: message })
            } else {
                console.log(`User with id ${id}: `, user)
                res.json({
                    id: user.id,
                    login: user.login,
                    password: user.password,
                    age: user.age,
                    isDeleted: user.isDeleted,
                    groups: user.groups,
                    groupIds: user.groupIds
                });
            }
        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async createUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = req.body;
            await this.userService.addUser(user);
            res.json({});
    
        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params
            let userReq = req.body;
    
            console.log(`Updating user with ${id}`)
            console.log('User request data: ', userReq)
    
            userReq.id = id;
    
            let user = this.userService.getUserById(id);
            if (user === undefined || user === null) {
                const message = `User with id ${id} not found`;
                console.error(message);
                res.status(404).json({ message: message });
            } else {
                await this.userService.updateUser(userReq);
                console.log(`Updated user with ${id}: `);
                res.json();
            }
        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async deleteUser(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params
            console.log(`Deleting user with ${id}`)
    
            let user = await this.userService.getUserById(id);
            if (user === undefined) {
                const message = `User with id ${id} not found`;
                console.error(message)
                res.status(404).json({ message: message })
            } else {
                this.userService.deleteUser(id);
                console.log(`Deleted user with ${id}: `)
                res.json()
            }
        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

}