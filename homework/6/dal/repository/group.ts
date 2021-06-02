import { Group } from '../models';
import { GroupDataMapper } from "../mapper";
import { GroupEntity } from '../../services/domain';
import { User, UserGroup, Permission, GroupPermission } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { sequelize } from '../database'

export default class GroupRepository {
    async getAll() {
        const groups = await Group.findAll({ include: [Permission, User] });
        const groupDomainEntities = groups.map(u => GroupDataMapper.toDomainEntity(u));
        return groupDomainEntities;
    }

    async getById(id: string) {
        const group = await Group.findOne({ where: { id: id }, include: [Permission, User] });
        return group ? GroupDataMapper.toDomainEntity(group) : null;
    }

    async deleteById(id: string) {
        await Group.destroy({ where: { id: id } });
    }

    async update(groupEntity: GroupEntity) {
        const group = GroupDataMapper.toDalEntity(groupEntity);
        console.log("update group ", group.toJSON());
        await Group.update(group.toJSON(), { where: { id: group.id } });

        if (Array.isArray(groupEntity.permissions) && groupEntity.permissions.length > 0) {
            // Delete old permission
            GroupPermission.destroy({ where: { groupId: group.id } });

            const permissions = await Permission.findAll({ where: { name: groupEntity.permissions } });

            const groupPermissions = permissions.map(p => ({
                groupId: group.id,
                permissionId: p.id
            }));

            await GroupPermission.bulkCreate(groupPermissions);
        }

        if (Array.isArray(groupEntity.userIds) && groupEntity.userIds.length > 0) {
            // Delete old permission
            UserGroup.destroy({ where: { groupId: group.id } });

            const users = await User.findAll({ where: { id: groupEntity.userIds } });

            const userGroup = users.map(user => ({
                groupId: group.id,
                userId: user.id
            }));

            await UserGroup.bulkCreate(userGroup);
        }
    }

    async add(groupEntity: GroupEntity) {
        groupEntity.id = uuidv4();
        const group = GroupDataMapper.toDalEntity(groupEntity);
        await group.save();

        if (Array.isArray(groupEntity.permissions) && groupEntity.permissions.length > 0) {
            const permissions = await Permission.findAll({ where: { name: groupEntity.permissions } });

            const groupPermissions = permissions.map(p => ({
                groupId: group.id,
                permissionId: p.id
            }));

            await GroupPermission.bulkCreate(groupPermissions);
        }

        if (Array.isArray(groupEntity.userIds) && groupEntity.userIds.length > 0) {
            const users = await User.findAll({ where: { id: groupEntity.userIds } });

            const userGroup = users.map(user => ({
                groupId: group.id,
                userId: user.id
            }));

            await UserGroup.bulkCreate(userGroup);
        }
    }

    async addUsersToGroup(id: string, userIds: string[]) {
        try {
            await sequelize.transaction(async (t) => {
                if (Array.isArray(userIds) && userIds.length > 0) {
                    const users = await User.findAll({ where: { id: userIds } });

                    const userGroup = users.map(user => ({
                        groupId: id,
                        userId: user.id
                    }));

                    console.log("userGroup", userGroup);

                    await UserGroup.bulkCreate(userGroup);
                }

            });

        } 
        catch (error) {
            console.error(error);
        }
    }
}