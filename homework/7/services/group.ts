import { GroupRepository } from '../dal/repository'
import { GroupEntity } from './domain';

export default class GroupService {
    readonly groupRepository: GroupRepository;

    constructor() {
        this.groupRepository = new GroupRepository();
    }

    async getGroups() {
        const groupEntities = await this.groupRepository.getAll();
        return groupEntities;
    }

    async getGroupById(id: string) {
        const groupEntity = await this.groupRepository.getById(id);
        return groupEntity;
    }

    async deleteGroup(id: string) {
        await this.groupRepository.deleteById(id);
    }

    async updateGroup(groupEntity: GroupEntity) {
        await this.groupRepository.update(groupEntity);
    }

    async addUsersToGroup(id: string, userIds: string[]) {
        console.log("user ids: ", userIds);
        await this.groupRepository.addUsersToGroup(id, userIds);
    }

    async addGroup(groupEntity: GroupEntity) {
        console.log("userEntity", groupEntity);
        await this.groupRepository.add(groupEntity);
    }
}