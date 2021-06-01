import { Sequelize } from "sequelize-typescript";
import User from './models/user';
import Group from './models/group'
import Permission from './models/permission'
import GroupPermission from './models/groupPermission'
import { v4 as uuidv4 } from 'uuid';
import UserGroup from "./models/userGroup";

let sequelize;

const initDatabase = async () => {
    let connectionString = process.env.CONNECTION_STRING ?? "";
    console.log("connectionString" + connectionString);

    sequelize = new Sequelize(connectionString);
    sequelize.addModels([User, Group, Permission, GroupPermission, UserGroup]);

    await sequelize.sync({ force: true });

    return sequelize;
}

const seed = async () => {
    await seedPermissions();
    await seedGroupUser();
}

const seedGroupUser = async () => {
    // Seed groups
    const group1 = await Group.create({
        id: uuidv4(),
        name: "group 1",
    });

    await GroupPermission.create({
        groupId: group1.id,
        permissionId: 1,
    });

    const group2 = await Group.create({
        id: uuidv4(),
        name: "group 2"
    });

    const group3 = await Group.create({
        id: uuidv4(),
        name: "group 3"
    });

    const group4 = await Group.create({
        id: uuidv4(),
        name: "group 4"
    });

    const group5 = await Group.create({
        id: uuidv4(),
        name: "group 5"
    });

    // Seed users
    const user1 = await User.create({
        id: uuidv4(),
        login: "apple",
        password: "P@ssword123",
        age: 29,
        isDeleted: false
    });

    const user2 = await User.create({
        id: uuidv4(),
        login: "banana",
        password: "P@ssword123",
        age: 29,
        isDeleted: false
    });

    const user3 = await User.create({
        id: uuidv4(),
        login: "lemon",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });

    const user4 = await User.create({
        id: uuidv4(),
        login: "watermelon",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });

    const user5 = await User.create({
        id: uuidv4(),
        login: "peach",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });

    const user6 = await User.create({
        id: uuidv4(),
        login: "cherry",
        password: "P@ssword123",
        age: 29,
        isDeleted: true
    });

    // Seed user_group
    await UserGroup.bulkCreate([{
        userId: user1.id,
        groupId: group1.id
    },
    {
        userId: user1.id,
        groupId: group2.id
    }, {
        userId: user1.id,
        groupId: group3.id
    }]);

    await UserGroup.bulkCreate([{
        userId: user2.id,
        groupId: group2.id
    },{
        userId: user2.id,
        groupId: group3.id
    }]);

    await UserGroup.bulkCreate([{
        userId: user3.id,
        groupId: group3.id
    }]);
};



const seedPermissions = async () => {
    await Permission.create({
        id: 1,
        name: "READ"
    });
    await Permission.create({
        id: 2,
        name: "WRITE"
    });
    await Permission.create({
        id: 3,
        name: "DELETE"
    });
    await Permission.create({
        id: 4,
        name: "SHARE"
    });
    await Permission.create({
        id: 5,
        name: "UPLOAD_FILES"
    });
}

export {
    initDatabase,
    seed,
    sequelize
};