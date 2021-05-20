import User from './models/user';
import UserDataMapper from "./models/userDataMapper";
import UserDomainEntity from '../services/entities/userDomainEntity';
import Group from './models/group';
import UserGroup from './models/userGroup';

export default class UserRepository {
    async getAll() {
        const users = await User.findAll({ include: Group });
        const userDomainEntities = users.map(u => UserDataMapper.toDomainEntity(u));
        return userDomainEntities;
    }
    async getById(id: string) {
        const user = await User.findOne({ where: { id: id }, include: Group });
        return user ? UserDataMapper.toDomainEntity(user) : null;
    }

    async deleteById(id: string) {
        await User.destroy({ where: { id: id } });
    }

    async update(userEntity: UserDomainEntity) {
        let user = UserDataMapper.toDalEntity(userEntity);
        console.log("updateUser ", user.toJSON());
        await User.update(user.toJSON(), { where: { id: user.id } });

        if (Array.isArray(userEntity.groupIds) && userEntity.groupIds.length > 0) {
            // Delete old permission
            UserGroup.destroy({ where: { userId: user.id } });

            const groups = await Group.findAll({ where: { id: userEntity.groupIds } });

            const userGroup = groups.map(group => ({
                groupId: group.id,
                userId: user.id
            }));

            await UserGroup.bulkCreate(userGroup);
        }
    }

    async add(userEntity: UserDomainEntity) {
        const user = UserDataMapper.toDalEntity(userEntity);
        await user.save();

        if (Array.isArray(userEntity.groupIds) && userEntity.groupIds.length > 0) {
            const groups = await Group.findAll({ where: { id: userEntity.groupIds } });

            const userGroup = groups.map(group => ({
                groupId: group.id,
                userId: user.id
            }));

            await UserGroup.bulkCreate(userGroup);
        }
    }
}