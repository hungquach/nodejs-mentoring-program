import UserDalEntity from './models/userDalEntity';
import UserDataMapper from "./models/userDataMapper";
import UserDomainEntity from '../services/entities/userDomainEntity';

export default class UserRepository {
    async getAll() {
        const users = await UserDalEntity.findAll();
        const userDomainEntities = users.map(u => UserDataMapper.toDomainEntity(u));
        return userDomainEntities;
    }
    async getById(id: string) {
        const user = await UserDalEntity.findOne({ where: { id: id } });
        return user ? UserDataMapper.toDomainEntity(user) : null;
    }

    async deleteById(id: string) {
        const user = await UserDalEntity.findOne({ where: { id: id } });
        if (user) {
            user.isDeleted = true;
            user.save();
        }
    }

    async updateUser(userEntity: UserDomainEntity) {
        let user = UserDataMapper.toDalEntity(userEntity);
        console.log("updateUser ", user.toJSON());
        await UserDalEntity.update(user.toJSON(), { where: { id: user.id } });
    }

    async addUser(userEntity: UserDomainEntity) {
        const user = UserDataMapper.toDalEntity(userEntity);
        await user.save();
    }
}