import UserRepository from '../dal/userRepository'
import UserDomainEntity from './entities/userDomainEntity';

export default class UserService  {
    userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepository();
    }

    async getUsers() {
        var userEntities = await this.userRepository.getAll();
        return userEntities;
    }

    async getUserById(id: string) {
        var userEntity = await this.userRepository.getById(id);
        return userEntity;
    }

    async deleteUser(id: string) {
        await this.userRepository.deleteById(id);
    }

    async updateUser(userEntity: UserDomainEntity) {
        await this.userRepository.updateUser(userEntity);
    }

    async addUser(userEntity: UserDomainEntity) {
        console.log("userEntity", userEntity);
        await this.userRepository.addUser(userEntity);
    }
}