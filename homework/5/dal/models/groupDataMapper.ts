import GroupDomainEntity from "../../services/entities/groupDomainEntity";
import Group from "./group";

export default class GroupDataMapper {
    public static toDomainEntity(dalEntity: Group): GroupDomainEntity {
        console.log("Group: ", dalEntity.toJSON());
        return {
            id: dalEntity.id,
            name: dalEntity.name,
            permissions: Array.isArray(dalEntity.permissions) && dalEntity.permissions.length > 0 ? dalEntity.permissions.map(p => p.name) : [],
            users: Array.isArray(dalEntity.users) && dalEntity.users.length > 0 ? dalEntity.users.map(p => p.login) : [],
            userIds: Array.isArray(dalEntity.users) && dalEntity.users.length > 0 ? dalEntity.users.map(p => p.id) : [],
        }
    };

    public static toDalEntity(domainEntity: GroupDomainEntity): Group {
        return Group.build(
            {
                id: domainEntity.id,
                name: domainEntity.name
            }
        );
    };
}