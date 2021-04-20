import UserDomainEntity from "../../services/entities/userDomainEntity";
import UserDalEntity from "./userDalEntity";

export default class UserDataMapper {
    public static toDomainEntity(dalEntity: UserDalEntity): UserDomainEntity {
        return {
            id: dalEntity.id,
            login: dalEntity.login,
            password: dalEntity.password,
            age: dalEntity.age,
            isDeleted: dalEntity.isDeleted
        }
    };

    public static toDalEntity(domainEntity: UserDomainEntity): UserDalEntity {
        return UserDalEntity.build(
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