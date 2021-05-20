import GroupRepository from '../dal/groupRepository'
import GroupDomainEntity from './entities/groupDomainEntity';

export default class GroupService  {
    groupRepository: GroupRepository;

    constructor(){
        this.groupRepository = new GroupRepository();
    }

    async getGroups() {
        var groupEntities = await this.groupRepository.getAll();
        return groupEntities;
    }

    async getGroupById(id: string) {
        var groupEntity = await this.groupRepository.getById(id);
        return groupEntity;
    }

    async deleteGroup(id: string) {
        await this.groupRepository.deleteById(id);
    }

    async updateGroup(groupEntity: GroupDomainEntity) {
        await this.groupRepository.update(groupEntity);
    }

    async addUsersToGroup(id: string, userIds: string[]) {
        console.log("user ids: ", userIds);
        await this.groupRepository.addUsersToGroup(id, userIds);
    }

    async addGroup(groupEntity: GroupDomainEntity) {
        console.log("userEntity", groupEntity);
        await this.groupRepository.add(groupEntity);
    }
}