import express from 'express';
import joi from 'joi';
import GroupService from '../services/groupService';
import Utils from '../services/utils';
import logger from '../logger';

const utils = new Utils();

const groupRouter = express.Router();

// Services
const groupService = new GroupService();

const groupSchema = joi.object().keys({
    id: joi.string(),
    name: joi.string().required(),
    permissions: joi.array(),
    userIds: joi.array().required()
})

const groupUsersSchema = joi.object().keys({
    userIds: joi.array().required()
})

groupRouter.get('/groups', async (req, res) => {
    try {
        const userEntities = await groupService.getGroups();

        console.log('Get all users from DB', userEntities);

        const { order = 'asc' } = req.query

        return (order === 'asc') ? res.json(userEntities) : res.json(userEntities.reverse())
    }
    catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }

})

groupRouter.get('/groups/:id', async (req, res) => {
    try {
        const { id } = req.params
        console.log(`Get group by id ${id}`)

        const group = await groupService.getGroupById(id);

        if (group === undefined || group === null) {
            const message = `Group with id ${id} not found`;
            console.error(message)
            res.status(404).json({ message: message })
        } else {
            console.log(`Group with id ${id}: `, group)
            res.json(group)
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

groupRouter.get('/getAutoSuggestGroups', async (req, res) => {
    try {
        const groupEntities = await groupService.getGroups();
        console.log('Load groups from DB to memory', groupEntities);

        const { loginSubstring = '', limit = 10 } = req.query

        let filteredGroups = groupEntities.filter(group => group.name.includes(loginSubstring as string)).sort((a: any, b: any) => b.login - a.login).slice(0, limit as number)

        return res.json(filteredGroups);
    } catch (error) {
        logger.error('Method: ' + req.method);
        logger.error('Request query: ' + JSON.stringify(req.query));
        logger.error('Request params: ' + JSON.stringify(req.params));
        logger.error('Request body: ' + JSON.stringify(req.body));
        logger.error('Message: ' + error);
        throw error;
    }
})

groupRouter.post('/groups', utils.validateSchema(groupSchema), async (req, res) => {
    try {
        const group = req.body
        await groupService.addGroup(group);
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

groupRouter.post('/groups/:id/users', utils.validateSchema(groupUsersSchema), async (req, res) => {
    try {
        const { id } = req.params
        const { userIds } = req.body
        await groupService.addUsersToGroup(id, userIds);
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


groupRouter.put('/groups/:id', utils.validateSchema(groupSchema), async (req, res) => {
    try {
        const { id } = req.params
        let groupReq = req.body;

        console.log(`Updating group with ${id}`)
        console.log('Group request data: ', groupReq)

        groupReq.id = id;

        let group = groupService.getGroupById(id);
        if (group === undefined || group === null) {
            const message = `Group with id ${id} not found`;
            console.error(message);
            res.status(404).json({ message: message });
        } else {
            await groupService.updateGroup(groupReq);
            console.log(`Updated group with ${id}: `);
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

groupRouter.delete('/groups/:id', async (req, res) => {
    try {
        const { id } = req.params
        console.log(`Deleting group with ${id}`)

        let group = await groupService.getGroupById(id);
        if (group === undefined) {
            const message = `Group with id ${id} not found`;
            console.error(message)
            res.status(404).json({ message: message })
        } else {
            groupService.deleteGroup(id);
            console.log(`Deleted group with ${id}: `)
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

export default groupRouter