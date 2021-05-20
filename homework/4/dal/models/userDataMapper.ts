import UserDomainEntity from "../../services/entities/userDomainEntity";
import User from "./user";

export default class UserDataMapper {
    public static toDomainEntity(dalEntity: User): UserDomainEntity {
        return {
            id: dalEntity.id,
            login: dalEntity.login,
            password: dalEntity.password,
            age: dalEntity.age,
            isDeleted: dalEntity.isDeleted,
            groups: Array.isArray(dalEntity.groups) && dalEntity.groups.length > 0 ? dalEntity.groups.map(p => p.name) : [],
            groupIds: Array.isArray(dalEntity.groups) && dalEntity.groups.length > 0 ? dalEntity.groups.map(p => p.id) : [],
        }
    };

    public static toDalEntity(domainEntity: UserDomainEntity): User {
        return User.build(
            {
                id: domainEntity.id,
                login: domainEntity.login,
                password: domainEntity.password,
                age: domainEntity.age,
                isDeleted: domainEntity.isDeleted
            }
        );
    };
}