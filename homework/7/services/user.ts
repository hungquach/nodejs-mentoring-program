import { UserRepository } from '../dal/repository'
import { UserEntity } from './domain';
import { JwtService } from '.';

export default class UserService {
    readonly userRepository: UserRepository;
    readonly jwtService: JwtService;

    constructor() {
        this.userRepository = new UserRepository();
        this.jwtService = new JwtService();
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

    async updateUser(userEntity: UserEntity) {
        await this.userRepository.update(userEntity);
    }

    async addUser(userEntity: UserEntity) {
        console.log("userEntity", userEntity);
        await this.userRepository.add(userEntity);
    }

    async generateJwtToken(username: string, password: string) {
        const user = await this.userRepository.getUserByUserName(username);

        if(user === null || user.password != password) {
            throw new Error("user not found or invalid");
        }

        let payload = {
            id: user.login
        };

        const token = await this.jwtService.generateJwtToken(payload)
               
        return token;
    }
}