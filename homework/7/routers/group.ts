import express from 'express';
import joi from 'joi';
import Utils from '../services/utils';
import { GroupController } from '../controllers';
import { passport } from '../config';

const utils = new Utils();

const groupRouter = express.Router();

const groupSchema = joi.object().keys({
    id: joi.string(),
    name: joi.string().required(),
    permissions: joi.array(),
    userIds: joi.array().required()
})

const groupUsersSchema = joi.object().keys({
    userIds: joi.array().required()
})

const groupController = new GroupController();

groupRouter.get('/groups', passport.authenticate('jwt', { session: false }), groupController.getGroups.bind(groupController));

groupRouter.get('/groups/suggest', passport.authenticate('jwt', { session: false }), groupController.getSuggestion.bind(groupController));

groupRouter.get('/groups/:id', passport.authenticate('jwt', { session: false }), groupController.getGroupDetail.bind(groupController));

groupRouter.post('/groups', passport.authenticate('jwt', { session: false }), utils.validateSchema(groupSchema), groupController.createGroup.bind(groupController));

groupRouter.post('/groups/:id/users', passport.authenticate('jwt', { session: false }), utils.validateSchema(groupUsersSchema), groupController.getUserBelongToGroup.bind(groupController));

groupRouter.put('/groups/:id', passport.authenticate('jwt', { session: false }), utils.validateSchema(groupSchema), groupController.updateGroup.bind(groupController));

groupRouter.delete('/groups/:id', passport.authenticate('jwt', { session: false }), groupController.deleteGroup.bind(groupController));

export default groupRouter