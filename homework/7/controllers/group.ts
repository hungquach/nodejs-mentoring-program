import { GroupService } from '../services';
import express from 'express';
import { logger } from '../config';

export default class GroupController {
    readonly groupService: GroupService;
    constructor() {
        this.groupService = new GroupService();
    }

    async getGroups(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const groups = await this.groupService.getGroups();
            logger.info('Get all groups from DB: ' + JSON.stringify(groups));

            const { order = 'asc' } = req.query || 'asc'

            const response = groups.map(group => ({
                id: group.id,
                name: group.name,
                permissions: group.permissions,
                users: group.users,
                userIds: group.userIds
            }));

            return (order === 'asc') ? res.json(response) : res.json(response.reverse())
        }
        catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async getSuggestion(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const groups = await this.groupService.getGroups();
            logger.info('Load groups from DB to memory' + JSON.stringify(groups));

            const { name = '', limit = 10 } = req.query

            const response = groups
                .filter(group => group.name.includes(name as string))
                .sort((a: any, b: any) => b.login - a.login)
                .slice(0, limit as number)
                .map(group => ({
                    id: group.id,
                    name: group.name,
                    permissions: group.permissions,
                    users: group.users,
                    userIds: group.userIds
                }));

            return res.json(response);
        } catch (error) {
            logger.error('Method: ' + req.method);
            logger.error('Request query: ' + JSON.stringify(req.query));
            logger.error('Request params: ' + JSON.stringify(req.params));
            logger.error('Request body: ' + JSON.stringify(req.body));
            logger.error('Message: ' + error);
            next(error);
        }
    }

    async getGroupDetail(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params
            logger.info(`Get group by id ${id}`);

            const group = await this.groupService.getGroupById(id);

            if (group === undefined || group === null) {
                const message = `Group with id ${id} not found`;
                console.error(message)
                res.status(404).json({ message: message })
            } else {
                console.log(`Group with id ${id}: `, group)
                res.json({
                    id: group.id,
                    name: group.name,
                    permissions: group.permissions,
                    users: group.users,
                    userIds: group.userIds
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

    async createGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const group = req.body
            await this.groupService.addGroup(group);
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

    async getUserBelongToGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params
            const { userIds } = req.body
            await this.groupService.addUsersToGroup(id, userIds);
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

    async updateGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params
            let groupReq = req.body;

            logger.info(`Updating group with ${id}`);
            logger.info('Group request data: ' + JSON.stringify(groupReq));

            groupReq.id = id;

            let group = this.groupService.getGroupById(id);
            if (group === undefined || group === null) {
                const message = `Group with id ${id} not found`;
                logger.error(message);
                res.status(404).json({ message: message });
            } else {
                await this.groupService.updateGroup(groupReq);
                logger.info(`Updated group with ${id}: `);
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

    async deleteGroup(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params
            logger.info(`Deleting group with ${id}`)
    
            let group = await this.groupService.getGroupById(id);
            if (group === undefined) {
                const message = `Group with id ${id} not found`;
                logger.error(message);
                res.status(404).json({ message: message })
            } else {
                this.groupService.deleteGroup(id);
                logger.info(`Deleted group with ${id}: `)
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